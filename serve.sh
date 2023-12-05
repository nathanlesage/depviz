#!/bin/bash

# Starts and demonizes process. NOTE that this doesn't print
# the PID so you'll have to TOP your way there.
PID=$(python server.py </dev/null &>/dev/null &)
