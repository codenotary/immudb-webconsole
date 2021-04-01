#!/usr/bin/env bash

# bash script to generate tree structure of a directory
# Pravendra Singh : https://pravj.github.io

echo "generatin nuxt content structure json file"

# change directory temporaly to ./pages/careers
pushd '../src/content/'

# pwd=$(pwd)
# find $pwd -print | sed -e "s;$pwd;\.;g;s;[^/]*\/;|__;g;s;__|; |;g"

# tree -a -J -o nuxt_content_tree.json
tree -J

# goes back to starting directory
popd