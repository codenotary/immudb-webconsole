all: player-immuclient 

player-immuclient: Dockerfile start.sh bin bin/immudumper bin/immusetup
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@


bin:
	mkdir -p bin
	
bin/immudumper: ../tools/immudumper/immudumper
	cp $^ $@
../tools/immudumper/immudumper:
	make -C ../tools/immudumper

bin/immusetup: ../tools/immusetup/immusetup
	cp $^ $@
../tools/immusetup/immusetup:
	make -C ../tools/immusetup
