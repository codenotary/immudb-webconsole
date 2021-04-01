FROM golang:alpine as builder1
RUN apk update && apk add --no-cache git make bash build-base
WORKDIR /src
RUN git clone --depth 1 https://github.com/codenotary/immudb.git
WORKDIR /src/immudb
RUN make immuclient-static immudb-static

FROM alpine:latest
RUN apk update && apk add --no-cache bash expect
COPY --from=builder1 /src/immudb/immuclient /usr/bin/immuclient
COPY --from=builder1 /src/immudb/immudb /usr/bin/immudb
ADD start.sh /usr/local/bin/start.sh
ENTRYPOINT /usr/local/bin/start.sh
