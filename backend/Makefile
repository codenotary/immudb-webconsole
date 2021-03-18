V_VERSION ?=  0.1
V_COMMIT ?= $(shell git rev-parse HEAD|head -c 7)
V_BUILT_AT = $(shell date +%s)
V_LDFLAGS := -X "main.Version=$(V_VERSION)"\
        -X "main.Buildtime=$(V_BUILT_AT)"\
        -X "main.Commit=$(V_COMMIT)"\



all: playground-backend

playground-backend: dockerops.go main.go tarfunc.go python.go runner.go docs/docs.go
	go build -ldflags '$(V_LDFLAGS)' playground-backend
	
.PHONY: swag
swag:
	~/go/bin/swag init
