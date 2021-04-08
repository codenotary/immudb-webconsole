package main

import (
	"bytes"
	// 	"context"
	"encoding/json"
	//         "errors"
	"fmt"
	// 	"github.com/docker/docker/api/types"
	// 	"github.com/docker/docker/api/types/container"
	// 	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	// 	"time"
)

type runRequest struct {
	Code   string `json:"code"`
	Immudb []byte `json:"immudb"`
	Token  []byte `json:"token"`
}

type OutputLine struct {
	Timestamp float64 `json:"timestamp"`
	Type      string  `json:"type"` // {console|immudb}
	// type=console
	Flux string `json:"flux,omitempty"`
	Line string `json:"line,omitempty"`
	// type=immudb
	Immudb   []byte `json:"immudb,omitempty"`
	Tree     []byte `json:"tree,omitempty"`
	Token    []byte `json:"token,omitempty"`
	Verified bool   `json:"verified,omitempty"`
}

type InputLine struct {
	Line string `json:"line"`
	Cmd  string `json:"cmd"`
}

type runResponse struct {
	Output   []OutputLine `json:"output"`
	Immudb   []byte       `json:"immudb"`
	Tree     []byte       `json:"tree"`
	Token    []byte       `json:"token"`
	Verified bool         `json:"verified"`
}

// @id pythonExec
// @tags player
// @summary Execute a python script
// @accept application/json
// @param request body runRequest true "Run request"
// @produce application/json
// @success 200 {object} runResponse
// @failure 400
// @failure 500
// @router /exec/python [post]
func pythonExec(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
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
	// extract immudb token file
	if len(req.Token) > 0 {
		err = ioutil.WriteFile(path.Join(dir, "statefile"), req.Token, 0644)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Error: %s", err.Error())
			return
		}
	}
	// launch the container
	err = runContainer(cli, "player-py:latest", dir)
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
