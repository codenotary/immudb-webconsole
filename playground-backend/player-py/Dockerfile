FROM python:3-alpine as builder1
RUN apk update && apk add --no-cache make gcc build-base linux-headers python3-dev g++
RUN python -mvenv /app && \
    cd /app && \
    source bin/activate && \
    pip install immudb-py
    
FROM golang:alpine as builder2
RUN apk update && apk add --no-cache git make bash
WORKDIR /src
RUN git clone --depth 1 https://github.com/codenotary/immudb.git
WORKDIR /src/immudb
RUN GOOS=linux GOARCH=amd64 make immuadmin-static immudb-static


FROM python:3-alpine
RUN apk update && apk add --no-cache libstdc++
COPY --from=builder1 /app /app
COPY --from=builder2 /src/immudb/immudb /usr/sbin/immudb
ADD start.sh /start.sh
ADD immudumper /usr/local/bin/immudumper
RUN chmod +x /start.sh /usr/sbin/immudb /usr/local/bin/immudumper
ENTRYPOINT /start.sh
