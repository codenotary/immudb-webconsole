package main

import (
	"context"
	"log"

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

func main() {
	client, ctx := connect()
	var i uint64
	size := getSize(client, ctx)
	f_out := zfile.CreateZFile("dump.json.gz")
	defer f_out.Close()
	f_out.WriteString("[\n")
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
	}
	f_out.WriteString("\n]\n")
}
