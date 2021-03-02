package main

import (
	"encoding/json"
	"fmt"
	"github.com/swaggo/http-swagger"
	"log"
	"net/http"
	_ "playground/docs"
)

// @title Playground REST server
// @version 1.0
// @description This is a PoC playground rest server
// @termsOfService http://codenotary.com/terms

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @BasePath /v1

var Version = "dev"
var Buildtime = "--"
var Commit = "--"

type versionInfo struct {
	Version   string `json:"version"`
	Buildtime string `json:"buildtime"`
}

// showVersion ...
// @id showVersion
// @tags info
// @summary Show software version
// @produce application/json
// @success 200 {object} main.versionInfo
// @router /info/version [get]
func showVersion(w http.ResponseWriter, r *http.Request) {
	var jresponse = versionInfo{fmt.Sprintf("%s-%s", Version, Commit), Buildtime}
	response, _ := json.Marshal(jresponse)
	fmt.Fprintf(w, string(response)+"\n")
}

func handleRequests() {
	http.HandleFunc("/v1/info/version", showVersion)
	http.HandleFunc("/v1/exec/run", runCode)
	http.HandleFunc("/swagger/", httpSwagger.Handler(httpSwagger.URL("doc.json")))
	err := http.ListenAndServe(":7771", nil)
	log.Fatal(err)
}

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	handleRequests()
}
