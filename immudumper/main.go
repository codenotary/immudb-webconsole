package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"flag"
	"github.com/codenotary/immudb/pkg/api/schema"
	immuclient "github.com/codenotary/immudb/pkg/client"
	stateService "github.com/codenotary/immudb/pkg/client/state"
// 	"github.com/codenotary/immudb/pkg/client/cache"
	"google.golang.org/grpc/metadata"
	"github.com/codenotary/immudb/pkg/logger"
	"immudumper/zfile"
	"log"
	"os"
	"time"
	"google.golang.org/grpc"
)


func MyCustomImmuClient(ctx context.Context, options *immuclient.Options) (cli immuclient.ImmuClient, err error) {
	cli = immuclient.DefaultClient()
	options.DialOptions = cli.SetupDialOptions(options)
	cli.WithOptions(options)
	var clientConn *grpc.ClientConn
	if clientConn, err = cli.Connect(ctx); err != nil {
		return nil, err
	}
	cli.WithClientConn(clientConn)
	serviceClient := schema.NewImmuServiceClient(clientConn)
	cli.WithServiceClient(serviceClient)
	if err = cli.WaitForHealthCheck(ctx); err != nil {
		return nil, err
	}
	immudbStateProvider := stateService.NewStateProvider(serviceClient)
	immudbUUIDProvider := stateService.NewUUIDProvider(serviceClient)
	stateService, err := stateService.NewStateService(
		NewForcedCache(config.statefile),
		logger.NewSimpleLogger("immuclient", os.Stderr),
		immudbStateProvider,
		immudbUUIDProvider)
	if err != nil {
		return nil, err
	}
	cli.WithStateService(stateService)
	return cli, nil
}

func connect() (immuclient.ImmuClient, context.Context) {
	ctx := context.Background()
	opts := immuclient.DefaultOptions()
	client, err := MyCustomImmuClient(ctx, opts)
	if err != nil {
		log.Fatal(err)
	}
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
	outfile   string
	statefile string
	verified  string
}

func init() {
	flag.StringVar(&config.outfile, "outfile", "", "output filename (gzipped). If none given, will print to stdout.")
	flag.StringVar(&config.statefile, "statefile", "/tmp/statefile", "Immudb Current State (token) file.")
	flag.StringVar(&config.verified, "verified", "/tmp/verified", "This file will be touched if transactions are verified and consistent with provided state file.")
	flag.Parse()
}

func touch(fileName string) {
	_, err := os.Stat(fileName)
	if os.IsNotExist(err) {
		file, err := os.Create(fileName)
		if err != nil {
			log.Fatal(err)
		}
		file.Close()
	} else {
		currentTime := time.Now().Local()
		err = os.Chtimes(fileName, currentTime, currentTime)
		if err != nil {
			log.Println(err)
		}
	}
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
	if size > 0 {
		_, err := client.VerifiedTxByID(ctx, size)
		if err == nil {
			touch(config.verified)
		}
	}
}
