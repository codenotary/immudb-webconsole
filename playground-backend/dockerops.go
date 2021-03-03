package main

import (
	"bytes"
	"context"
	"encoding/json"
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
)

type runRequest struct {
	Code   string `json:"code"`
	Immudb []byte `json:"immudb"`
}
type runResponse struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
	Immdub []byte `json:"immudb"`
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
		&container.Config{Image: "player-py:latest", Tty: false},
		&container.HostConfig{
			Mounts: []mount.Mount{
				{Type: mount.TypeBind, Source: dir, Target: "/tmp"},
			},
		},
		nil,      //net config
		nil,      // platform
		"Mennea") // name
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	defer cli.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{})
	err = cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{})
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	statusCh, errCh := cli.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	select {
	case err = <-errCh:
		if err != nil {
			log.Printf("Error: %s", err.Error())
			return
		}
	case <-statusCh:
	}
	err = doTarball(ctx, dir, path.Join(dir, "data"), path.Join(dir, "data.tar.gz"))
	if err != nil {
		log.Printf("Error while extracting immudb data: %s", err.Error())
		return
	}

	return
}

func readback(dir string) (response runResponse, err error) {
	stdout, err := ioutil.ReadFile(path.Join(dir, "stdout"))
	if err != nil {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	stderr, err := ioutil.ReadFile(path.Join(dir, "stderr"))
	if err != nil {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	immudb, err := ioutil.ReadFile(path.Join(dir, "data.tar.gz"))
	if err != nil {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	response = runResponse{string(stdout), string(stderr), immudb}
	return
}
