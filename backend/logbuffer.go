package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type runLogLine struct {
	Timestamp float64 `json:"timestamp"`
	Label     string  `json:"label"`
	Container string  `json:"container"`
	Logline   string  `json:"logentry"`
}

type runLog struct {
	Lines []*runLogLine `json:"lines"`
	Size  int           `json:"size"`
}

func NewRunLog(size int) *runLog {
	return &runLog{Lines: make([]*runLogLine, size), Size: size}
}

func (rl *runLog) Append(label, container string, line string) {
	newline := &runLogLine{
		Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
		Label:     label,
		Container: container,
		Logline:   line}
	if len(rl.Lines) < rl.Size {
		rl.Lines = append(rl.Lines, newline)
	} else {
		rl.Lines = append(rl.Lines[1:], newline)
	}
}

func (rl *runLog) JsonDump() string {
	dump, _ := json.Marshal(rl)
	return string(dump)
}

var globalRunLog *runLog

func init() {
	globalRunLog = NewRunLog(16)
}

// @id execLog
// @tags player
// @summary Return last 16 container run logs
// @produce application/json
// @success 200 {object} runLog
// @router /exec/logs [get]
func execLog(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, globalRunLog.JsonDump())
}
