#!/bin/sh
/usr/sbin/immudb --dir /tmp/data -d # >> /tmp/stdout 2>> /tmp/stderr
/app/bin/python3 /tmp/runme.py > /tmp/stdout 2> /tmp/stderr
/usr/local/bin/immudumper -outfile /tmp/dump.json.gz
