#!/bin/sh
/usr/bin/immudb --dir /tmp/data -d # >> /tmp/stdout 2>> /tmp/stderr
/usr/local/bin/immusetup
unbuffer -p /bin/bash "$@"
