package zfile

import (
	"bufio"
	"compress/gzip"
	"log"
	"os"
)

type zfile struct {
	f  *os.File
	gf *gzip.Writer
	fw *bufio.Writer
}

func CreateZFile(s string) (zf zfile) {
	var err error
	zf.f, err = os.OpenFile(s, os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0660)
	if err != nil {
		log.Fatal(err)
	}
	zf.gf = gzip.NewWriter(zf.f)
	zf.fw = bufio.NewWriter(zf.gf)
	return
}

func (zf *zfile) Write(b []byte) {
	zf.fw.Write(b)
}

func (zf *zfile) WriteString(s string) {
	zf.fw.WriteString(s)
}

func (zf *zfile) Close() {
	zf.fw.Flush()
	zf.gf.Close()
	zf.f.Close()
}
