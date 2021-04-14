package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/fsnotify/fsnotify"
	"golang.org/x/net/websocket"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
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
	outBuffer []byte
}

var runners map[string]*runner

const TIMEOUT = 30 * time.Second

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
			Debug.Printf("=> %v", outgoingLine)
			jresp, _ := json.Marshal(outgoingLine)
			outgoing <- jresp
		}
		fin <- true
	}(atc.Reader)
	Debug.Printf("Running loop for container %s", rn.container)
	idletimeout := time.NewTimer(TIMEOUT)
	dumptimeout := time.NewTimer(1000 * time.Millisecond)
	dumptimeout.Stop()
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Println("Watcher error: %s", err.Error())
	}
	defer watcher.Close()
	go func() {
		time.Sleep(5 * time.Second) // give immudb the chance to come up
		err := filepath.Walk(path.Join(rn.ephdir, "data"),
			func(path string, fi os.FileInfo, err error) error {
				return watcher.Add(path)
			})
		if err != nil {
			log.Printf("Watcher error: %s", err.Error())
		}
	}()
	for {
		select {
		case s := <-rn.clientIn:
			idletimeout.Reset(TIMEOUT)
			Debug.Printf("<== %s", string(s))
			var line WSInput
			err := json.Unmarshal(s, &line)
			if err != nil {
				log.Printf("Error while reading command: %s [%+v]", err.Error(), s)
				break
			}
			switch {
			case line.Line != "":
				atc.Conn.Write([]byte(line.Line))
			case line.Cmd == "dump":
				rn.dumpImmudb()
			case line.Cmd == "exec":
				rn.execCode(line.Code)
			}
		case ev := <-watcher.Events:
			Debug.Printf("File event incoming: %+v", ev)
			dumptimeout.Reset(200 * time.Millisecond)
		case err = <-watcher.Errors:
			Debug.Printf("File error incoming: %s", err.Error())
		case <-dumptimeout.C:
			rn.dumpImmudb()
		case s := <-outgoing:
			Debug.Printf("<= %s", string(s))
			if len(rn.clientOut) > 0 {
				for _, c := range rn.clientOut {
					c <- s
				}
			} else {
				rn.outBuffer = append(rn.outBuffer, s...)
			}
		case <-fin:
			return
		case <-idletimeout.C:
			log.Printf("Timeout expired for %s", rn.shortid)
			return
		}
	}
}

func (rn *runner) dumpImmudb() {
	Debug.Printf("Dumping container %s [%s]", rn.shortid, rn.container)
	cmd := []string{"/usr/local/bin/immudumper", "-outfile", "/tmp/dump.json.gz", "-statefile", "/tmp/statefile", "-verified", "/tmp/verified"}

	output, err := containerExec(rn.ctx, cmd, rn.container)
	if err != nil {
		log.Printf("Got error while dumping: %s.%s", err.Error(), output)
		return
	}
	globalRunLog.Append("player-immuclient", rn.container, output)
	Debug.Printf("Container dumped %s [%s]:", rn.shortid, rn.container)
	dump, err := ioutil.ReadFile(path.Join(rn.ephdir, "dump.json.gz"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reding immudb dump: %s", err.Error())
		return
	}
	token, err := ioutil.ReadFile(path.Join(rn.ephdir, "statefile"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reding immudb statefile: %s", err.Error())
		return
	}
	_, err = os.Stat(path.Join(rn.ephdir, "verified"))
	verified := (err == nil)
	// create a tarball of immudb DATA
	err = doTarball(rn.ctx, rn.ephdir, path.Join(rn.ephdir, "data"), path.Join(rn.ephdir, "data.tar.gz"))
	if err != nil {
		log.Printf("Error while compressing immudb data: %s", err.Error())
		return
	}

	immutarball, err := ioutil.ReadFile(path.Join(rn.ephdir, "data.tar.gz"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}

	outline := WSOutput{
		Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
		Type:      "immudb",
		Immudb:    immutarball,
		Tree:      dump,
		Token:     token,
		Verified:  verified,
	}
	jout, _ := json.Marshal(outline)
	for _, c := range rn.clientOut {
		c <- jout
	}
}

func (rn *runner) execCode(code string) {
	Debug.Printf("Executing code in container %s [%s]", rn.shortid, rn.container)
	// put code into ephimeral volume
	err := ioutil.WriteFile(path.Join(rn.ephdir, "runme.py"), []byte(code), 0644)
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	defer os.Remove(path.Join(rn.ephdir, "runme.py"))
	defer os.Remove(path.Join(rn.ephdir, "output"))
	cmd := []string{"/bin/sh", "-c", "/usr/local/bin/jts /app/bin/python3 /tmp/runme.py > /tmp/output"}
	output, err := containerExec(rn.ctx, cmd, rn.container)
	if err != nil {
		log.Printf("Got error while executing: %s.%s", err.Error(), output)
		return
	}
	bOutput, err := ioutil.ReadFile(path.Join(rn.ephdir, "output"))
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Error while reading python output: %s", err.Error())
		return
	}
	var jOutput []OutputLine
	if err = json.Unmarshal(bOutput, &jOutput); err != nil {
		log.Printf("Error while decoding python output: %s [%s]", err.Error(), string(bOutput))
		return
	}
	response := WSOutput{
		Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
		Type:      "exec",
		Lines:     jOutput}
	jout, _ := json.Marshal(response)
	for _, c := range rn.clientOut {
		c <- jout
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
// @accept application/json
// @param request body runRequest true "Run request"
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
	// extract immudb state
	var reqData runRequest
	err = json.NewDecoder(req.Body).Decode(&reqData)
	if err != nil && err != io.EOF {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error: %s", err.Error())
		return
	}
	if len(reqData.Immudb) > 0 {
		err = extractTarball(bytes.NewReader(reqData.Immudb), dir)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Error: %s", err.Error())
			return
		}
	}
	ctx := context.Background()
	c_id, err := startContainer(ctx, "player-live", dir)
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
	for _, c := range rn.clientOut {
		close(c)
	}
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
		Debug.Printf("Exiting i/o for container %s", rn.shortid)
		for i, c := range rn.clientOut {
			if c == clOut {
				Debug.Printf("Removing channel for %s", rn.shortid)
				copy(rn.clientOut[i:], rn.clientOut[i+1:])
				rn.clientOut = rn.clientOut[:len(rn.clientOut)-1]
				break
			}
		}
	}()
	if len(rn.outBuffer) > 0 {
		ws.Write(rn.outBuffer)
		rn.outBuffer = nil
	}
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
			/*
				outline := WSOutput{
						Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
					}
				jout, _ := json.Marshal(outline)
				if _,err := ws.Write(jout); err != nil {
					Debug.Printf("Error writing socket for %s: %s", rn.shortid, err.Error())
					break
				}
			*/
		}
		Debug.Printf("Exiting goroutine for %s", rn.shortid)
		end <- true
	}(rn.clientIn)
loop:
	for {
		select {
		case <-end:
			break loop
		case b := <-clOut:
			if len(b) == 0 {
				Debug.Printf("Exiting websocket loop for %s", rn.shortid)
				break loop
			}

			Debug.Printf("<-- %s", string(b))
			if _, err := ws.Write(b); err != nil {
				Debug.Printf("Error writing socket for %s: %s", rn.shortid, err.Error())
				break loop
			}
		}
	}
	Debug.Printf("Exiting websock handler for container %s", rn.shortid)
}
