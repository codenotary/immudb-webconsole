all: player-py

player-py: Dockerfile start.sh bin bin/immudumper bin/immusetup
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@
	
bin/immudumper: ../tools/immudumper/immudumper
	cp $^ $@

bin:
	mkdir -p bin

.PHONY: ../tools/immudumper/immudumper
../tools/immudumper/immudumper:
	make -C ../tools/immudumper

bin/immusetup: ../tools/immusetup/immusetup
	cp $^ $@

.PHONY: ../tools/immusetup/immusetup
../tools/immusetup/immusetup:
	make -C ../tools/immusetup
