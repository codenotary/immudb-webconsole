# immudb Embedded Web-Console

[![build](https://github.com/codenotary/immudb-webconsole/actions/workflows/ci.yml/badge.svg)](https://github.com/codenotary/immudb-webconsole/actions/workflows/ci.yml)

An embedded management and query web-console for [immudb](https://github.com/codenotary/immudb).

## Requirements

The development should happens on the LTS node version: 14.18.0

It is recommended to use the Node Version Manager (nvm), to install and
manage a specific version of node (Doc: https://github.com/nvm-sh/nvm).

## Development Setup

The following command should be runned within the dir **client**

1. Install dependencies.

```bash
npm install
```

2. Create a new `.env` file and add the following environment variables:

```bash
DOCKER_API_URL=/docker-api/
API_URL=/api/
METRICS_API_URL=/metrics-api/

# following values are atomic

# Use that if you want to target the demo backend
#DOCKER_API_URL=/demo/docker-api/
#API_URL=/demo/api/
#METRICS_API_URL=/demo/metrics-api/

PUBLIC_DEMO=0
DEMO_URL=https://demo.immudb.io

#GOOGLE_ANALYTICS_ID=UA-188271351-1

# Update with a fallback commit hash 
VUE_APP_GIT_COMMIT_HASH=17d4ce2
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

### troubleshooting using port 80|443
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