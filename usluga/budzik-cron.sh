#!/bin/sh
# Zadanie 42: na OMENie z crona co minutę — pilnuje, żeby budzik (usluga/budzik.mjs, port 8769) żył.
#   * * * * * sh ~/budzik/hacknation-proba17/usluga/budzik-cron.sh
/usr/bin/curl -s -m 2 -o /dev/null http://127.0.0.1:8769/stan && exit 0
cd "$(dirname "$0")/.." || exit 1
nohup /usr/local/bin/node usluga/budzik.mjs >> "$HOME/budzik/budzik.log" 2>&1 &
