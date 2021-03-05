all: player-py

player-py: Dockerfile start.sh immudumper jts
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	
immudumper: ../immudumper/immudumper
	cp $^ $@

jts: ../tools/jts/jts
	cp $^ $@

.PHONY: ../immudumper/immudumper
../immudumper/immudumper:
	make -C ../immudumper

../tools/jts/jts:
	make -C ../tools/jts
