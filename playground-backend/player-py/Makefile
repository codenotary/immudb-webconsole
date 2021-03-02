all: player-py

player-py: Dockerfile start.sh
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	
