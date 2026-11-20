#!/bin/sh
# Zadanie 31: deterministyczne wygenerowanie danych scenariuszy (tylko CPU/numpy, bez GPU).
# Uruchamiane przez orkiestrator --maszyna dowolna --klasa testy.
set -e
PZ=${PZ:-$HOME/dane/scenariusze}
python dane/generator/scenariusze.py --wyj dane/scenariusze --poza "$PZ"
ls -la dane/scenariusze dane/scenariusze/nieprawidlowy dane/scenariusze/czyste_zero
ls -la "$PZ/duzy"
ls "$PZ/czyste_p49" | wc -l
