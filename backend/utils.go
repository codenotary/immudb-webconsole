package main
import (
	"math/rand"
	"time"
	"log"
	"encoding/binary"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
func init() {
	rand.Seed(time.Now().UnixNano())
}

func randString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Int63() % int64(len(letterBytes))]
	}
return string(b)
}


func demux(in []byte) (out []byte) {
	if len(in)<8 {
		log.Printf("Frame too short")
		return
	}
	if in[0]<0 || in[0]>2|| in[1]!=0 || in[2]!=0 || in[3]!=0 {
		log.Printf("Wrong magic number")
	}
	l := binary.BigEndian.Uint32(in[4:8])
	if len(in)!=int(8+l) {
		log.Printf("Wrong len, got %d instead of %d", len(in), 8+l)
	}
	out = make([]byte,l+2)
	out[0]=48+in[0]
	out[1]=':'
	copy(out[2:],in[8:l+8])
	return out
}
