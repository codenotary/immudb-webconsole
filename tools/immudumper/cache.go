package main

import (
	"encoding/base64"
	"fmt"
	"github.com/codenotary/immudb/pkg/api/schema"
	"github.com/codenotary/immudb/pkg/client/cache"
	"github.com/golang/protobuf/proto"
	"github.com/rogpeppe/go-internal/lockedfile"
	"io/ioutil"
	"strings"
)

type forcedCache struct {
	filename string
}

func NewForcedCache(fn string) *forcedCache {
	return &forcedCache{filename: fn}
}

func (fc *forcedCache) Get(serverUUID, db string) (*schema.ImmutableState, error) {
	raw, err := ioutil.ReadFile(fc.filename)
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(raw), "\n")
	for _, line := range lines {
		if strings.Contains(line, db+":") {
			r := strings.Split(line, ":")
			if r[1] == "" {
				return nil, fmt.Errorf("could not find previous state")
			}
			oldState, err := base64.StdEncoding.DecodeString(r[1])
			if err != nil {
				return nil, fmt.Errorf("could not find previous state")
			}
			state := &schema.ImmutableState{}
			if err = proto.Unmarshal(oldState, state); err != nil {
				return nil, err
			}
			return state, nil
		}
	}
	return nil, fmt.Errorf("could not find previous state")
}

func (fc *forcedCache) Set(serverUUID, db string, state *schema.ImmutableState) error {
	raw, err := proto.Marshal(state)
	if err != nil {
		return err
	}

	input, _ := ioutil.ReadFile(fc.filename)
	lines := strings.Split(string(input), "\n")

	newState := db + ":" + base64.StdEncoding.EncodeToString(raw) + "\n"
	var exists bool
	for i, line := range lines {
		if strings.Contains(line, db+":") {
			exists = true
			lines[i] = newState
		}
	}
	if !exists {
		lines = append(lines, newState)
	}
	output := strings.Join(lines, "\n")

	if err = ioutil.WriteFile(fc.filename, []byte(output), 0644); err != nil {
		return err
	}
	return nil
}

func (fc *forcedCache) GetLocker(serverUUID string) cache.Locker {
	fm := lockedfile.MutexAt(fc.filename)
	return &FileLocker{lm: fm}
}

type FileLocker struct {
	lm         *lockedfile.Mutex
	unlockFunc func()
}

func (fl *FileLocker) Lock() (err error) {
	fl.unlockFunc, err = fl.lm.Lock()
	return err
}

func (fl *FileLocker) Unlock() (err error) {
	if fl.unlockFunc == nil {
		return fmt.Errorf("try to lock a not locked file")
	}
	fl.unlockFunc()
	return nil
}
