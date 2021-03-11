package main

import (
	"bytes"
	"context"
	"encoding/json"
        "errors"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"time"
)

type runRequest struct {
	Code   string `json:"code"`
	Immudb []byte `json:"immudb"`
}
type OutputLine struct {
	Timestamp float64 `json:"timestamp"`
	Flux      string  `json:"flux"`
	Line      string  `json:"line"`
}

type runResponse struct {
	Output []OutputLine `json:"output"`
	Immudb []byte       `json:"immudb"`
	Tree   []byte       `json:"tree"`
}

// runCode ...
// @id runCode
// @tags info
// @summary Show software version
// @accept application/json
// @param request body runRequest true "Run request"
// @produce application/json
// @success 200 {object} runResponse
// @failure 400
// @failure 500
// @router /exec/run [post]
func runCode(w http.ResponseWriter, r *http.Request) {
	var req runRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error: %s", err.Error())
		return
	}
	cli, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	defer cli.Close()
	// create ephimeral volume
	dir, err := ioutil.TempDir("/var/tmp", "ephvolume:")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	defer os.RemoveAll(dir)
	// put code into ephimeral volume
	err = ioutil.WriteFile(path.Join(dir, "runme.py"), []byte(req.Code), 0644)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	// extract immudb state
	if len(req.Immudb) > 0 {
		err = extractTarball(bytes.NewReader(req.Immudb), dir)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Error: %s", err.Error())
			return
		}
	}
	// launch the container
	err = runContainer(cli, dir)
	if err != nil {
		jresponse := errorResponse(err.Error(), req.Immudb)
		response, _ := json.Marshal(jresponse)
		http.Error(w, string(response), http.StatusInternalServerError)
		return
	}
	jresponse, err := readback(dir)
	if err != nil {
		log.Printf("Error while reading response: %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, _ := json.Marshal(jresponse)
	fmt.Fprintf(w, string(response)+"\n")
}

func runContainer(cli *client.Client, dir string) (err error) {
	ctx := context.Background()
	resp, err := cli.ContainerCreate(ctx,
		&container.Config{
			Image: "player-py:latest",
			Tty: false,
			},
		&container.HostConfig{
			Mounts: []mount.Mount{
				{Type: mount.TypeBind, Source: dir, Target: "/tmp"},
			},
			Resources: container.Resources{
				Memory: 1048576 * 100, // 100 MBytes
				// CPUQuota: 20_000, // 20% of available CPU (cfs)
			},
			NetworkMode: "none",
		},
		nil, //net config
		nil, // platform
		"")  // name
	c_id := resp.ID
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	defer cli.ContainerRemove(ctx, c_id, types.ContainerRemoveOptions{})
	err = cli.ContainerStart(ctx, c_id, types.ContainerStartOptions{})
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	log.Printf("Started container %s", c_id[0:12])
	start_time := time.Now()
	statusCh, errCh := cli.ContainerWait(ctx, c_id, container.WaitConditionNotRunning)
	select {
	case <-time.After(5 * time.Second):
		log.Printf("Timeout expired, killing container %s", c_id)
		killtimeout := 3 * time.Second
		err = cli.ContainerStop(ctx, c_id, &killtimeout)
		if err != nil {
			log.Printf("Unable to kill container %s", c_id)
			return 
		}
		return errors.New("Run time exceeded")
	case err = <-errCh:
		if err != nil {
			log.Printf("Error: %s", err.Error())
			return
		}
	case <-statusCh:
		log.Printf("Container %s ended in %s", c_id[0:12], time.Since(start_time))
	}
	err = doTarball(ctx, dir, path.Join(dir, "data"), path.Join(dir, "data.tar.gz"))
	if err != nil {
		log.Printf("Error while extracting immudb data: %s", err.Error())
		return
	}

	return
}

func readback(dir string) (response runResponse, err error) {
	var bOutput, immudb, dump []byte
	var jOutput []OutputLine
	bOutput, err = ioutil.ReadFile(path.Join(dir, "output"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reading python output: %s", err.Error())
		return
	}
	if err = json.Unmarshal(bOutput, &jOutput); err != nil {
		log.Printf("Error while decoding python output: %s", err.Error())
		return
	}
	
	immudb, err = ioutil.ReadFile(path.Join(dir, "data.tar.gz"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	dump, err = ioutil.ReadFile(path.Join(dir, "dump.json.gz"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reding immudb dump: %s", err.Error())
		return
	}
	response = runResponse{jOutput, immudb, dump}
	return response, nil
}

func errorResponse(msg string, immudb []byte) (response runResponse) {
	response.Output=[]OutputLine{{
		Timestamp:float64(time.Now().UnixNano())/1000000.0,
		Flux:"execerr",
		Line:msg,
	}}
	response.Immudb=immudb
	return
}
