all: player-immuclient

player-immuclient: Dockerfile start.sh
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	

