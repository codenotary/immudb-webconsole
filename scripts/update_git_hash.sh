#!/bin/sh

touch .env
file=.env

if [ -f /.dockerenv ]; then
	sed -i "/VUE_APP_GIT_COMMIT_HASH/c\VUE_APP_GIT_COMMIT_HASH=$WEBCONSOLE_VERSION" $file
else
	grep -q '^VUE_APP_GIT_COMMIT_HASH=' $file || echo 'VUE_APP_GIT_COMMIT_HASH=VALUE' >> $file
	sed -i "/VUE_APP_GIT_COMMIT_HASH/c\VUE_APP_GIT_COMMIT_HASH=$(git rev-parse --short HEAD)" $file
fi
