# immudb Embedded Web-Console

[![build](https://github.com/codenotary/immudb-webconsole/actions/workflows/ci.yml/badge.svg)](https://github.com/codenotary/immudb-webconsole/actions/workflows/ci.yml)

An embedded management and query web-console for [immudb](https://github.com/codenotary/immudb).

## Requirements

The development should happens on the LTS node version: 14.18.0

It is recommended to use the Node Version Manager (nvm), to install and
manage a specific version of node (Doc: https://github.com/nvm-sh/nvm).

Before running

## Development Setup

The following command should be runned within the dir **client**

1. Install dependencies.

```bash
npm install
```

2. Create a new `.env` file and add the following environment variables:

```bash
# ======================================== #
# ---------------- DYNAMIC --------------- #
# ======================================== #

# -----------------------------------------
# 1. BASIC CONFIG
# -----------------------------------------

### FE host config
HOST=localhost

### FE port config (eg: 80|443)
# using 443 will activate SSL (may require sudo)
PORT=8081

### Target BE config
# chose one value prefixed by '>':
# - local:
#		> (leave empty to use local BE)
#		docker
# - cloud:
#		> demo
TARGET=demo

# To be setted as 1 for the public cloud webconsole
# (eg: deploying to https://demo.immudb.io)
PUBLIC_DEMO=0

## ngrok forwarding domain
# obtained after using the cmd (ngrok http <port>)
# leave blank to use the FE hostname as api base url
NGROK=

# GOOGLE ANALYTICS
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXXX-1
GOOGLE_ANALYTICS_SITEKEY=XXXXXXXXX

# ======================================== #
# ---------------- STATIC ---------------- #
# ======================================== #

# Will be automatically updated by the
# update_git_hash.sh script runned on
# prebuild and pregenerate
VUE_APP_GIT_COMMIT_HASH=xxxxxx

# -----------------------------------------
# 3. CLOUD URLs (no need to change those)
# -----------------------------------------

# Demo appliance
DEMO_URL=https://demo.immudb.io

```

3. Start the application: 

```bash
$ npm run dev

```

The preview website on localhost:8080 will reflect changes every time a .md file is updated and saved (live reload).

## Building

```bash
# install dependencies
$ npm i

# serve with hot reload at localhost:8081
$ npm run dev

# generate static project
$ npm run generate

# serve the /dist directory
npx http-server /dist
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Troubleshooting

### Using port 80|443
In case you set the PORT as 80 or 443 you might get an EACCES error.

To solve it run the following commands in your local environment.

```
sudo apt-get install libcap2-bin

sudo setcap cap_net_bind_service=+ep $(which node)
```

Afterward you'll be allowed to run your local FE instance without sudo simply as:

```
npm run dev
```

### With /login api call
If, when trying to login, you see a message saying 'login received no response' it may
be that you're runnin the webconsole with PUBLIC_DEMO turned on in the .env configuration
file (every value except 0 will result in PUBLIC_DEMO being turned on).

### With /metrics
If you see something like 'VM1419:1 GET http://localhost:9497/metrics net::ERR_CONNECTION_REFUSED' it could mean that there is no immudb or prometheus running on your local dev environmnent 