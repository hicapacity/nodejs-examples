#!/bin/bash

# Check for NPM
type -P npm &>/dev/null || { echo ">>> NPM not installed. Please install using: curl http://npmjs.org/install.sh | sh" >&2; exit 1; }

# Install dependencies (too lazy to figure out exact versions)
npm install express@2.3.12
npm install request@1.9.8
npm install redis@0.6.0
npm install socket.io@0.7.2
npm install node-static@0.5.6
npm install oauth@0.9.1
npm install cron@0.1.2
npm install htmlparser@1.7.3
npm install twitter-node@0.0.2

# Create symlink in all directories
DIRS=$(find `pwd` -d 1 -type d \( -not -iname ".*" -and -not -iname "node_modules" \))

for dir in $DIRS
do
    if [ -h $dir/node_modules ]
        then
            rm $dir/node_modules
    fi
    ln -s `pwd`/node_modules $dir/node_modules
done
