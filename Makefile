V_COMMIT := $(shell git rev-parse HEAD|head -c 7)
VARS = --build-arg V_COMMIT=$(V_COMMIT)

all: build

.PHONY: build
build:
	docker-compose build $(VARS)
	make -C player-py
