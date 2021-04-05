package main

import (
	"context"
	"github.com/codenotary/immudb/pkg/api/schema"
	"github.com/codenotary/immudb/pkg/auth"
	immuclient "github.com/codenotary/immudb/pkg/client"
	"google.golang.org/grpc/metadata"
	"log"
)

const username = "immudumper"
const password = "pica.ZOma0"

func connect() (immuclient.ImmuClient, context.Context) {
	ctx := context.Background()
	opts := immuclient.DefaultOptions()
	client, err := immuclient.NewImmuClient(opts)
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

func main() {
	client, ctx := connect()
	users, err := client.ListUsers(ctx)
	if err != nil {
		log.Fatal("Unable to read users: %s", err.Error())
	}
	// 	log.Printf("Users: %+v", users.Users)
	present := false
	for _, u := range users.Users {
		if string(u.User) == username {
			present = true
			break
		}
	}
	if !present {
		client.CreateUser(ctx, []byte(username), []byte(password), auth.PermissionAdmin, "defaultdb")
	}
}
