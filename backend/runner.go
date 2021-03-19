package main

import (
	"bufio"
// 	"bytes"
	"context"
	"encoding/json"
	"fmt"
// 	"io"
	"golang.org/x/net/websocket"
// 	"github.com/docker/docker/pkg/stdcopy"
	"log"
	"net/http"
	"path"
)

type runner struct {
	ctx       context.Context
	running   bool
	container string
	clientIn  chan []byte
	clientOut []chan []byte
}

var runners map[string]*runner

func (rn *runner) loop() {
	log.Printf("Running loop for container %s", rn.container)
	rn.running = true
	defer func() {
		rn.running = false
		log.Printf("Exiting loop for container %s", rn.container)
	}()
	atc, err := attachContainer(rn.ctx, rn.container)
	if err != nil {
		log.Printf("Error %s", err.Error())
		return
	}
	incoming := make(chan []byte)
	fin := make(chan bool)
	go func(rd *bufio.Reader) {
 		buffer := make([]byte,65536)
		for {
			if rn.running == false {
				log.Printf("=> Parent dead")
				return
			}
			n, err := rd.Read(buffer)
// 			stdout := new(bytes.Buffer)
// 			stderr := new(bytes.Buffer)
// 			n, err := stdcopy.StdCopy(stdout, stderr, rd)
			log.Printf("=> <:%d:%v:>", n,err)
			if n==0 {
				log.Printf("zero")
				break
			}
			if err != nil {
				log.Printf("Incoming error: %s", err.Error())
				break
				}
// 			log.Printf("=> <:o:%s:o:>", stdout.String())
// 			log.Printf("=> <:e:%s:e:>", stderr.String())
// 			resp := append(stdout.Bytes(),stderr.Bytes()...)
			resp := demux(buffer[:n])
			
			log.Printf("=> %v",resp)
			incoming <- resp
		}
		fin <- true
	}(atc.Reader)
	log.Printf("Running loop for container %s (2)", rn.container)
	for {
		select {
		case s := <-rn.clientIn:
			log.Printf("<== %s", string(s))
			atc.Conn.Write(s)
		case s := <-incoming:
			log.Printf("<= %s", string(s))
			for _, c := range rn.clientOut {
				c <- s
			}
		case <-fin:
			return
		}
	}
}

type runnerResponse struct {
	Status string `json:"status"`
	Id     string `json:"id,omitempty"`
	Error  string `json:"error,omitempty"`
}

type listrunnerResponse struct {
	Ids []string `json:"ids"`
}

func init() {
	runners = make(map[string]*runner)
}

func httpRet(w http.ResponseWriter, ret *runnerResponse) {
	jresponse, _ := json.Marshal(ret)
	sresp := string(jresponse) + "\n"
	if ret.Status != "success" {
		http.Error(w, sresp, http.StatusInternalServerError)
	} else {
		fmt.Fprintf(w, sresp)
	}

}

// @id newRunner
// @tags runner
// @summary Launch a new container for interactive use
// @produce application/json
// @success 200 {object} runnerResponse
// @failure 400
// @failure 500
// @router /run/new [post]
func newRunner(w http.ResponseWriter, req *http.Request) {
	ctx := context.Background()
	c_id, err := startContainer(ctx, "player-immuclient")
	if err != nil {
		httpRet(w, &runnerResponse{Status: "fail", Error: err.Error()})
		return
	}
	rn := &runner{
		ctx:       ctx,
		container: c_id,
		clientIn:  make(chan []byte),
	}
	s_id := randString(9)
	runners[s_id] = rn
	go rn.loop()
	httpRet(w, &runnerResponse{Status: "success", Id: s_id})
}

// @id listRunners
// @tags runner
// @summary List containers ids of running containers for interactive ouse
// @produce application/json
// @success 200 {object} listrunnerResponse
// @failure 400
// @failure 500
// @router /run/list [get]
func listRunners(w http.ResponseWriter, req *http.Request) {
	ret := &listrunnerResponse{Ids: make([]string, 0, len(runners))}
	for i, _ := range runners {
		ret.Ids = append(ret.Ids, i)
	}
	jret, _ := json.Marshal(ret)
	fmt.Fprintf(w, string(jret))
}

// @id closeRunner
// @tags runner
// @summary Halts and delete an interactive container
// @param id path string true "Container id"
// @produce application/json
// @success 200 {object} runnerResponse
// @failure 400 {object} runnerResponse
// @failure 500 {object} runnerResponse
// @router /run/close/{id} [post]
func closeRunner(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		httpRet(w, &runnerResponse{Status: "fail", Error: "Invalid method"})
		return
	}
	reqId := path.Base(r.URL.Path)
	rn, ok := runners[reqId]
	if !ok {
		log.Printf("Id '%s' not found", reqId)
		httpRet(w, &runnerResponse{Status: "fail", Error: "container id not found"})
		return
	}
	if err := stopContainer(rn.ctx, rn.container); err != nil {
		httpRet(w, &runnerResponse{Status: "fail", Error: err.Error()})
		return
	}
	delete(runners, reqId)
	httpRet(w, &runnerResponse{Status: "success", Id: reqId})
}

func eventRunner(w http.ResponseWriter, r *http.Request) {
	reqId := path.Base(r.URL.Path)
	rn, ok := runners[reqId]
	if !ok {
		log.Printf("Id '%s' not found", reqId)
		httpRet(w, &runnerResponse{Status: "fail", Error: "container id not found"})
		return
	}
	if !rn.running {
		log.Printf("Container not running")
		httpRet(w, &runnerResponse{Status: "fail", Error: "Container not running"})
		return
	}
	s := websocket.Server{Handler: websocket.Handler(func(ws *websocket.Conn) {
		wsRunnerEvents(rn, ws)
	})}
	s.ServeHTTP(w, r)
}

func wsRunnerEvents(rn *runner, ws *websocket.Conn) {
	log.Printf("Serving i/o for container %s", rn.container)
	end := make(chan bool)
	clOut := make(chan []byte)
	rn.clientOut = append(rn.clientOut, clOut)
	defer func() {
		for i, c := range rn.clientOut {
			if c == clOut {
				copy(rn.clientOut[i:], rn.clientOut[i+1:])
				rn.clientOut = rn.clientOut[:len(rn.clientOut)-1]
				break
			}
			log.Printf("Exiting i/o for container %s", rn.container)
		}
	}()
	go func(clIn chan []byte) {
		for {
			buf := make([]byte, 65536)
			_, err := ws.Read(buf)
			if err != nil {
				log.Printf("runner error %s", err.Error())
				break
			}
			log.Printf("--> %s", string(buf))
			clIn <- buf
		}
		end <- true
	}(rn.clientIn)
loop:
	for {
		select {
		case <-end:
			break loop
		case b := <-clOut:
			log.Printf("<-- %s", string(b))
			ws.Write(b)
		}
	}
}
