#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# move to the webconsole path
pushd '../immudb'

echo ::Re-make immudb
make
echo ::Stopping immudb
sudo fuser -k 3322/tcp
sleep 1
echo ::Restarting immudb
./immudb

# move back to the previous directory
popd