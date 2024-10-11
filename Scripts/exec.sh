#!/bin/bash

DIR="$(dirname "$0")"
envDir="/var/autoreserva/env/script.env"

set -a
source "$envDir"
set +a

node "$DIR/src/main.js" >> echo log.txt
