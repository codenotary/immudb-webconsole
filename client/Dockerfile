FROM node:lts-alpine as build-stage
LABEL Ledger Compliance Playground Frontend Builder
WORKDIR /data
COPY ./*package*.json ./
RUN apk add --no-cache python3 git make gcc build-base
RUN npm i --quiet
COPY . .
ARG API_URL
ENV API_URL=$API_URL
ENV GOOGLE_ANALYTICS_ID=XXXXXX
ENV GOOGLE_ANALYTICS_SITEKEY=XXXXXX
RUN echo ":: API_URL = $API_URL"
RUN echo ":: GOOGLE_ANALYTICS_ID=$GOOGLE_ANALYTICS_ID"
RUN echo ":: GOOGLE_ANALYTICS_SITEKEY=$GOOGLE_ANALYTICS_SITEKEY"
RUN npm run build && npm run generate

FROM nginx:stable-alpine as production-stage
LABEL Ledger Compliance Playground Frontend Webserver
COPY --from=build-stage /data/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production
