#!/bin/bash

DIR="$(dirname "$0")"
envDir="/etc/autoreserva/env/script.env"

set -a
source "$envDir"
set +a

$NODE_PATH "$DIR/src/main.js" >> "$DIR/log.txt"
