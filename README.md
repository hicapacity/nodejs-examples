# NodeJS Examples

## Setup/Install

### install.sh

Run this rudimentary install if you want to try out the examples.  It installs
the dependencies, then symlinks node_modules in each directory.

## Node.js Introduction Code

Simple demonstration of node features.

demo1: Hello world and interval examples showing setTimeout and setInterval

demo2: Socket chat server

demo3: Supervisor, fs, and express

demo4: Express, Twitter streaming API, and Socket IO

## Domain Search

Allows you to see if a domain is available.

*Usage:* Load http://localhost:8000/domain in your browser (ie http://localhost:8000/google.com)

## Ghetto Proxy

Allows you to proxy sites through your site.  Doesn't rewrite any incoming
html, so may not work for all sites.

*Usage:* Load http://localhost:8000/www_address in your browser (ie http://localhost:8000/cnn.com)

## Hello World

Simple demonstration of the basic Hello World app

## Redis Pub/Sub chat
## RSS Cron to Redis
## Simple Hit Counter

Basic Hit Counter using Redis

## Twitter OAuth
## Twitter Socket IO

Uses Twitter-Node to crawl Twitter feeds and Socket.IO to stream tweets using Web Sockets.

## Twitter Tweet Map

Uses Twitter-Node to crawl Twitter feeds and store strings in Redis using a sorted set.  Hitting http://localhost:8000, you get to see the top 20 strings.  Proof of concept - could be used for trends, etc.
