#!/bin/sh
# Zadanie 42: na OMENie z crona co minutę — pilnuje, żeby budzik (usluga/budzik.mjs, port 8769) żył.
#   * * * * * sh ~/budzik/hacknation-proba17/usluga/budzik-cron.sh
# Sprawdza sam proces (nie /stan): /stan pyta usługę o zdrowie, a to nie może jej podtrzymywać.
pgrep -u "$(id -u)" -f "node usluga/budzik.mjs" > /dev/null && exit 0
cd "$(dirname "$0")/.." || exit 1
nohup /usr/local/bin/node usluga/budzik.mjs >> "$HOME/budzik/budzik.log" 2>&1 &
