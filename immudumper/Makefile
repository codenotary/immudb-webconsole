GOENV=CGO_ENABLED=0 GOOS=linux GOARCH=amd64

all: immudumper

immudumper: main.go tx.go cache.go zfile
	$(GOENV) go build
