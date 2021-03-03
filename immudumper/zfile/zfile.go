package zfile

import (
	"bufio"
	"compress/gzip"
	"log"
	"os"
)

type Outputter interface {
	Write(b []byte) (int, error)
	WriteString(s string) (int, error)
	Close() error
}

type zfile struct {
	f  *os.File
	gf *gzip.Writer
	fw *bufio.Writer
}

func CreateZFile(s string) Outputter {
	if s == "" {
		return os.Stdout
	}
	zf := zfile{}
	var err error
	zf.f, err = os.OpenFile(s, os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0660)
	if err != nil {
		log.Fatal(err)
	}
	zf.gf = gzip.NewWriter(zf.f)
	zf.fw = bufio.NewWriter(zf.gf)
	return &zf
}

func (zf *zfile) Write(b []byte) (int, error) {
	return zf.fw.Write(b)
}

func (zf *zfile) WriteString(s string) (int, error) {
	return zf.fw.WriteString(s)
}

func (zf *zfile) Close() error {
	zf.fw.Flush()
	zf.gf.Close()
	return zf.f.Close()
}
