all: player-py

player-py: Dockerfile start.sh immudumper
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	
immudumper: ../immudumper/immudumper
	cp $^ $@

.PHONY: ../immudumper/immudumper
../immudumper/immudumper:
	make -C ../immudumper

