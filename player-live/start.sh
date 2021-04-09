#!/bin/sh
/usr/sbin/immudb --dir /tmp/data -d 
/usr/local/bin/immusetup
echo "--MARK--"
unbuffer -p /bin/bash "$@"
