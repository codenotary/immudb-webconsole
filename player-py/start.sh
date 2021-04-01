#!/bin/sh
/usr/sbin/immudb --dir /tmp/data -d # >> /tmp/stdout 2>> /tmp/stderr
/usr/local/bin/immusetup
#/app/bin/python3 /tmp/runme.py > /tmp/stdout 2> /tmp/stderr
/usr/local/bin/jts /app/bin/python3 /tmp/runme.py > /tmp/output
/usr/local/bin/immudumper -outfile /tmp/dump.json.gz -statefile /tmp/statefile -verified /tmp/verified
