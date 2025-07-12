#!/usr/bin/env bash
set -euo pipefail

export NODE_ENV=test
export OPENAI_API_KEY=skip
export ODDS_API_KEY=skip
export TWILIO_SID=skip
export TWILIO_TOKEN=skip
export TWILIO_FROM=+1000000000
export TWILIO_TO=+1000000001

node dist/handler.js | cat