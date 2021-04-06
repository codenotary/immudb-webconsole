package main

import (
	"encoding/binary"
	"errors"
	"io"
	"log"
	"math/rand"
	"time"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func init() {
	rand.Seed(time.Now().UnixNano())
}

func randString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Int63()%int64(len(letterBytes))]
	}
	return string(b)
}

func demux(rd io.Reader) (outLine OutputLine, err error) {
	head := make([]byte, 8)
	n, err := rd.Read(head)
	if err != nil {
		log.Printf("Error while reading: %s", err.Error())
		return
	}
	if n == 0 {
		Debug.Printf("Zero byte input")
		return
	}
	if n < 8 {
		log.Printf("Frame too short")
		return outLine, errors.New("Frame too short")
	}
	if head[0] < 0 || head[0] > 2 || head[1] != 0 || head[2] != 0 || head[3] != 0 {
		log.Printf("Wrong magic number %v", head[0:8])
		return outLine, errors.New("Wrong magic number")
	}
	outLine.Timestamp = float64(time.Now().UnixNano()) / 1000000000.0
	switch head[0] {
	case 0:
		outLine.Flux = "stdin"
	case 1:
		outLine.Flux = "stdout"
	case 2:
		outLine.Flux = "stderr"
	}
	l := int(binary.BigEndian.Uint32(head[4:8]))
	chunk := make([]byte, l)
	for read := 0; read < l; {
		n, err = rd.Read(chunk)
		if err != nil {
			log.Printf("Error while reading body: %s", err.Error())
			return
		}
		outLine.Line = outLine.Line + string(chunk)
		read = read + n
	}
	return
}

func outLineSplit(outLine OutputLine) (ret []OutputLine) {
	k:=0
	for i,c := range outLine.Line {
		if c=='\n' {
			l := OutputLine{
				Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
				Line: outLine.Line[k:i+1],
			}
			ret=append(ret,l)
			k=i+1
		}
	}
	if k<len(outLine.Line) {
		l := OutputLine{
			Timestamp: float64(time.Now().UnixNano()) / 1000000000.0,
			Line: outLine.Line[k:],
		}
		ret=append(ret,l)
	}
	return
}
