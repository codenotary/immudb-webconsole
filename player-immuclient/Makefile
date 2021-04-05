all: player-immuclient 

player-immuclient: Dockerfile start.sh bin bin/immudumper bin/immusetup
	docker build -t $@ .
	docker images --no-trunc --quiet $@ > $@


bin:
	mkdir -p bin
	
bin/immudumper: ../tools/immudumper/immudumper
	cp $^ $@
../tools/immudumper/immudumper: ../tools/immudumper/cache.go  ../tools/immudumper/htree.go  ../tools/immudumper/main.go  ../tools/immudumper/tx.go
	make -C ../tools/immudumper

bin/immusetup: ../tools/immusetup/immusetup
	cp $^ $@
../tools/immusetup/immusetup: ../tools/immusetup/main.go
	make -C ../tools/immusetup
