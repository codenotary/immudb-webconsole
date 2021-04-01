all: player-py

player-py: Dockerfile start.sh immudumper
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	
immudumper: ../tools/immudumper/immudumper
	cp $^ $@

.PHONY: ../tools/immudumper/immudumper
../tools/immudumper/immudumper:
	make -C ../immudumper

