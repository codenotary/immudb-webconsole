#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# move to the webconsole path
pushd '../immudb/webconsole/'

echo :: Deleting webconsole content
rm -fr ./dist

# move back to the previous directorywebconsole
popd

echo :: Adding new dist files to webconsole
cp -a ./dist/. ../immudb/webconsole/dist/