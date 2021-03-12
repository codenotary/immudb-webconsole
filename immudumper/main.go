package main

import (
	"context"
	"flag"
	"log"

	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"github.com/codenotary/immudb/pkg/api/schema"
	immuclient "github.com/codenotary/immudb/pkg/client"
	"google.golang.org/grpc/metadata"
	"immudumper/zfile"
)

func connect() (immuclient.ImmuClient, context.Context) {
	opts := immuclient.DefaultOptions()
	client, err := immuclient.NewImmuClient(opts)
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr, err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))
	if err != nil {
		log.Fatal(err)
	}
	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(ctx, md)
	udr, err := client.UseDatabase(ctx, &schema.Database{Databasename: "defaultdb"})
	if err != nil {
		log.Fatal(err)
	}
	// Recollect the token that we get when using/switching the database.
	md = metadata.Pairs("authorization", udr.Token)
	ctx = metadata.NewOutgoingContext(ctx, md)

	return client, ctx
}

func getSize(client immuclient.ImmuClient, ctx context.Context) uint64 {
	s, err := client.CurrentState(ctx)
	if err != nil {
		log.Fatal(err)
	}
	log.Print(s)
	return s.TxId
}

var config struct {
	outfile string
}

func init() {
	flag.StringVar(&config.outfile, "outfile", "", "output filename (gzipped). If none given, will print to stdout.")
	flag.Parse()
}

func main() {
	client, ctx := connect()
	size := getSize(client, ctx)
	f_out := zfile.CreateZFile(config.outfile)
	defer f_out.Close()
	digests := make([][sha256.Size]byte, size)
	f_out.WriteString("[\n")
	var i uint64
	for i = 1; i <= size; i++ {
		if i > 1 {
			f_out.WriteString(",\n")
		}
		tx, err := client.TxByID(ctx, i)
		if err != nil {
			log.Fatal(err)
		}
		s := buildStruct(tx)
		j, err := json.Marshal(s)
		if err != nil {
			log.Fatal(err)
		}
		f_out.Write(j)
		alh, _ := hex.DecodeString(s.Root)
		copy(digests[i-1][:], alh)
	}
	if size > 0 {
		tree, _ := NewHTree(int(size))
		tree.BuildWith(digests)
		zero := "0000000000000000000000000000000000000000000000000000000000000000"
		for n, lev := range tree.levels {
			if n == 0 {
				continue
			}
			for i, node := range lev {
				tnode := txj{
					Metadata: tx_metadata{Id: uint64(1_000_000*(n+1) + 1_000*i)},
					Htree:    hex.EncodeToString(node[:]),
				}
				tnode.Hchild = []string{
					hex.EncodeToString(tree.levels[n-1][i<<1][:]),
					hex.EncodeToString(tree.levels[n-1][(i<<1)+1][:]),
				}
				if tnode.Htree == tnode.Hchild[0] && tnode.Hchild[1] == zero {
					// skip "empty" node
					continue
				}
				j, err := json.Marshal(tnode)
				if err != nil {
					log.Fatal(err)
				}
				f_out.WriteString(",\n")
				f_out.Write(j)
			}
		}
	}
	f_out.WriteString("\n]\n")

}
