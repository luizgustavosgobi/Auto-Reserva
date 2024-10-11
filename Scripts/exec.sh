#!/bin/bash

DIR="$(dirname "$0")"
envDir="/etc/autoreserva/env/script.env"

set -a
source "$envDir"
set +a

node "$DIR/src/main.js" >> echo log.txt
