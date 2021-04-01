#!/bin/sh
/usr/bin/immudb -d
touch /tmp/hello
unbuffer -p /bin/bash "$@"
