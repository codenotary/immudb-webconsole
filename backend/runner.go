package main

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/net/websocket"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"time"
)

type runner struct {
	ctx       context.Context
	shortid   string
	running   bool
	container string
	ephdir    string
	clientIn  chan []byte
	clientOut []chan []byte
}

var runners map[string]*runner

const TIMEOUT = 2 * time.Minute

func (rn *runner) loop() {
	Debug.Printf("Preparing loop for container %s", rn.container)
	rn.running = true
	defer func() {
		rn.running = false
		Debug.Printf("Exiting loop for container %s", rn.container)
		removeRunner(rn.shortid)
	}()
	atc, err := attachContainer(rn.ctx, rn.container)
	if err != nil {
		log.Printf("Error %s", err.Error())
		return
	}
	outgoing := make(chan []byte)
	fin := make(chan bool)
	go func(rd *bufio.Reader) {
		for {
			if rn.running == false {
				log.Printf("Parent is dead")
				return
			}
			outgoingLine, err := demux(rd)
			if err != nil {
				log.Printf("Incoming error: %s", err.Error())
				break
			}
			jresp, _ := json.Marshal(outgoingLine)
			Debug.Printf("=> %v", outgoingLine)
			outgoing <- jresp
		}
		fin <- true
	}(atc.Reader)
	Debug.Printf("Running loop for container %s", rn.container)
	idletimeout := time.NewTimer(TIMEOUT)
	for {
		select {
		case s := <-rn.clientIn:
			idletimeout.Reset(TIMEOUT)
			Debug.Printf("<== %s", string(s))
			var line InputLine
			err := json.Unmarshal(s, &line)
			if err != nil {
				log.Printf("Error while reading command: %s [%+v]", err.Error(), s)
			} else {
				atc.Conn.Write([]byte(line.Line))
			}
		case s := <-outgoing:
			Debug.Printf("<= %s", string(s))
			for _, c := range rn.clientOut {
				c <- s
			}
		case <-fin:
			return
		case <-idletimeout.C:
			log.Printf("Timeout expired for %s", rn.shortid)
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
	if req.Method != "POST" {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
	// create ephimeral volume
	dir, err := ioutil.TempDir("/var/tmp", "ephvolume:")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	ctx := context.Background()
	c_id, err := startContainer(ctx, "player-immuclient", dir)
	if err != nil {
		httpRet(w, &runnerResponse{Status: "fail", Error: err.Error()})
		return
	}
	s_id := randString(9)
	rn := &runner{
		ctx:       ctx,
		shortid:   s_id,
		container: c_id,
		ephdir:    dir,
		clientIn:  make(chan []byte),
	}
	runners[s_id] = rn
	go rn.loop()
	log.Printf("Created container %s [%s]", s_id, c_id)
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
	if req.Method != "GET" {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
	ret := &listrunnerResponse{Ids: make([]string, 0, len(runners))}
	for i, _ := range runners {
		ret.Ids = append(ret.Ids, i)
	}
	jret, _ := json.Marshal(ret)
	fmt.Fprintf(w, string(jret))
}

func removeRunner(reqId string) error {
	rn, ok := runners[reqId]
	if !ok {
		log.Printf("Id '%s' not found", reqId)
		return errors.New("Id not found")
	}
	if err := stopContainer(rn.ctx, rn.container); err != nil {
		return err
	}
	os.RemoveAll(rn.ephdir)
	delete(runners, reqId)
	log.Printf("Shut down container %s [%s]", reqId, rn.container)
	return nil
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
	if err := removeRunner(reqId); err != nil {
		httpRet(w, &runnerResponse{Status: "fail", Error: err.Error()})
	}
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
	Debug.Printf("Serving i/o for container %s", rn.container)
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
			Debug.Printf("Exiting i/o for container %s", rn.container)
		}
	}()
	go func(clIn chan []byte) {
		for {
			buf := make([]byte, 65536)
			n, err := ws.Read(buf)
			if err != nil {
				if err == io.EOF {
					Debug.Printf("runner error %s", err.Error())
				} else {
					log.Printf("runner error %s", err.Error())
				}
				break
			}
			buf = buf[:n]
			Debug.Printf("--> %s", string(buf))
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
			Debug.Printf("<-- %s", string(b))
			ws.Write(b)
		}
	}
}
