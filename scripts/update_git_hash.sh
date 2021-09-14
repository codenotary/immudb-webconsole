#!/bin/bash

touch .env
file=.env
grep -q '^VUE_APP_GIT_COMMIT_HASH=' $file || echo 'VUE_APP_GIT_COMMIT_HASH=VALUE' >> $file
sed -i "/VUE_APP_GIT_COMMIT_HASH/c\VUE_APP_GIT_COMMIT_HASH=$(git rev-parse --short HEAD)" $file