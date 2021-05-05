#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# move to the webconsole path
pushd '../immudb/webconsole/'

# echo :: Deleting webconsole content
# find . -not -name 'webconsole.go' -o -not -name 'webconsole_default.go' -delete

# move back to the previous directorywebconsole
popd

echo :: Adding new dist files to webconsole
cp -a ./dist/. ../immudb/webconsole/