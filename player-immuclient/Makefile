all: player-immuclient

player-immuclient: Dockerfile 
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	

