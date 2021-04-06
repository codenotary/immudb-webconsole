#!/bin/sh
/usr/bin/immudb --dir /tmp/data -d 
/usr/local/bin/immusetup
echo "--MARK--"
export PS1=
unbuffer -p /bin/bash "$@"
