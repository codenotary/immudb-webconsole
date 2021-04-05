V_COMMIT := $(shell git rev-parse HEAD|head -c 7)
VARS = --build-arg V_COMMIT=$(V_COMMIT)

all: build run stop

.PHONY: build backend frontend
build:
	docker-compose build $(VARS)
	make -C player-py
	make -C player-immuclient

backend:
	docker-compose build $(VARS) playgroundbackend
	make -C player-py

frontend:
	docker-compose build $(VARS) playgroundfrontend

run:
	docker-compose up -d $(VARS) --force-recreate

stop:
	docker-compose down -v --remove-orphans
