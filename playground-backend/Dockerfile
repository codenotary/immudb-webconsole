FROM golang:alpine as builder
RUN apk update && apk add --no-cache git make 
WORKDIR /src
ADD go.* Makefile /src/ 
RUN go mod download
ADD docs/* /src/docs/
ADD *.go /src/ 
ARG V_COMMIT=00000000
RUN make

FROM alpine:latest
WORKDIR /app
COPY --from=builder /src/playground-backend /app
ENTRYPOINT ["/app/playground-backend"]
