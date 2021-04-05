#!/bin/sh
/usr/bin/immudb --dir /tmp/data -d && echo "--MARK--"
/usr/local/bin/immusetup
unbuffer -p /bin/bash "$@"
