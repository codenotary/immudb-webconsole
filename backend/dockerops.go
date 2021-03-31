package main

import (
		"bytes"
	"context"
	"encoding/json"
	"errors"
	// 	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"io/ioutil"
	"log"
	// 	"net/http"
	"os"
	"path"
	"time"
)

const memoryLimit = 1048576 * 100 // 100 MBytes
const cpuLimit = 50_000           // 50% of vcpu

func runContainer(cli *client.Client, imageName, dir string) (err error) {
	ctx := context.Background()
	resp, err := cli.ContainerCreate(ctx,
		&container.Config{
			Image: imageName,
			Tty:   false,
		},
		&container.HostConfig{
			Mounts: []mount.Mount{
				{Type: mount.TypeBind, Source: dir, Target: "/tmp"},
			},
			Resources: container.Resources{
				Memory:   memoryLimit,
				CPUQuota: cpuLimit,
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
	logs, err := cli.ContainerLogs(ctx, c_id, types.ContainerLogsOptions{ ShowStdout:true, ShowStderr:true })
	if err==nil {
		buf := new(bytes.Buffer)
		buf.ReadFrom(logs)
		globalRunLog.Append(imageName, c_id, buf.String())
	} else {
		log.Printf("Error while fetching logs")
	}
	err = doTarball(ctx, dir, path.Join(dir, "data"), path.Join(dir, "data.tar.gz"))
	if err != nil {
		log.Printf("Error while extracting immudb data: %s", err.Error())
		return
	}
	return
}

func readback(dir string) (response runResponse, err error) {
	var bOutput, immudb, dump, token []byte
	var jOutput []OutputLine
	var verified bool
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
	token, err = ioutil.ReadFile(path.Join(dir, "statefile"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reding immudb statefile: %s", err.Error())
		return
	}
	_, err = os.Stat(path.Join(dir, "verified"))
	verified = (err == nil)
	response = runResponse{jOutput, immudb, dump, token, verified}
	return response, nil
}

func errorResponse(msg string, immudb []byte) (response runResponse) {
	response.Output = []OutputLine{{
		Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
		Flux:      "execerr",
		Line:      msg,
	}}
	response.Immudb = immudb
	return
}

func startContainer(ctx context.Context, imageName string) (id string, err error) {
	cli, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		log.Printf("Unable to contact docker %s")
		return
	}
	defer cli.Close()
	resp, err := cli.ContainerCreate(ctx,
		&container.Config{
			Image:        imageName,
			AttachStderr: false,
			AttachStdin:  false,
			Tty:          false, // set to false to allow multiplexing
			AttachStdout: false,
			OpenStdin:    true, // set to true to allow interactive use
		},
		&container.HostConfig{
			// 			Mounts: []mount.Mount{
			// 				{Type: mount.TypeBind, Source: dir, Target: "/tmp"},
			// 			},
			Resources: container.Resources{
				Memory:   memoryLimit,
				CPUQuota: cpuLimit,
			},
			NetworkMode: "none",
		},
		nil, //net config
		nil, // platform
		"")  // name
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	id = resp.ID
	if err = cli.ContainerStart(ctx, id, types.ContainerStartOptions{}); err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	return
}

func attachContainer(ctx context.Context, cid string) (atc types.HijackedResponse, err error) {
	cli, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		log.Printf("Unable to contact docker")
		return
	}
	defer cli.Close()
	atc, err = cli.ContainerAttach(ctx, cid, types.ContainerAttachOptions{
		Stderr: true,
		Stdout: true,
		Stdin:  true,
		Stream: true,
	})
	if err != nil {
		log.Printf("Unable to attach container %s", cid)
		return
	}
	return
}
func stopContainer(ctx context.Context, c_id string) (err error) {
	cli, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		log.Printf("Unable to contact docker")
		return
	}
	defer cli.Close()
	killtimeout := 3 * time.Second
	err = cli.ContainerStop(ctx, c_id, &killtimeout)
	if err != nil {
		log.Printf("Unable to stop container %s", c_id)
		return
	}
	cli.ContainerRemove(ctx, c_id, types.ContainerRemoveOptions{})
	return
}
