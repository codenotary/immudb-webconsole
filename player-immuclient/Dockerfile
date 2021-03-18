FROM golang:alpine as builder1
RUN apk update && apk add --no-cache git make bash build-base
WORKDIR /src
RUN git clone --depth 1 https://github.com/codenotary/immudb.git
WORKDIR /src/immudb
RUN make immuclient-static

FROM alpine:latest
COPY --from=builder1 /src/immudb/immuclient /usr/bin/immuclient
ENTRYPOINT /bin/sh
