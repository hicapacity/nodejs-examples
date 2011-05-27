#/bin/bash

# Check for NPM
type -P npm &>/dev/null || { echo ">>> NPM not installed. Please install using: curl http://npmjs.org/install.sh | sh" >&2; exit 1; }

# Install dependencies (too lazy to figure out exact versions)
npm install express
npm install request
npm install redis
npm install socket.io
npm install node-static
npm install oauth
npm install cron
npm install htmlparser
npm install twitter-node

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
