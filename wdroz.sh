#!/bin/sh
# Zadanie 21: jedna komenda — usługa na karcie OMENa + strona na ksefbot.pl + sprawdzenie zdrowia z linku.
# Uruchamiasz w kontenerze botów (tam są klucz hackathon, token orkiestratora i token Coolify), z katalogu klonu:
#   sh wdroz.sh             usługa (gdy śpi) + wdrożenie strony (wymaga POMIN_WDROZENIE=1) + zdrowie z linku
#   sh wdroz.sh --usluga    tylko usługa na karcie (np. przed testem albo pokazem), bez wdrożenia strony
#   --pokaz                 usługa bez bezczynności (na pokaz jury; po pokazie: sh wdroz.sh --usluga)
# Z Maca: ssh thinkpad 'docker exec -w <klon> omb-… sh wdroz.sh --usluga'
# Zmienne: OMEN_URL, DOMENA, GALAZ (gałąź do wdrożenia, domyślnie main), BEZCZYNNOSC (min, domyślnie 10), CZEKAJ_S.
set -eu
TYLKO_USLUGA=0; POKAZ=0
for a in "$@"; do
  case "$a" in
    --usluga) TYLKO_USLUGA=1 ;;
    --pokaz) POKAZ=1 ;;
    *) echo "nieznana opcja: $a" >&2; exit 64 ;;
  esac
done
KLON=$(cd "$(dirname "$0")" && pwd)
OMEN_URL=${OMEN_URL:-http://192.168.1.112:8770}
DOMENA=${DOMENA:-hacknation.ksefbot.pl}
GALAZ=${GALAZ:-main}
BEZCZYNNOSC=${BEZCZYNNOSC:-10}
[ "$POKAZ" = 1 ] && BEZCZYNNOSC=0
CZEKAJ_S=${CZEKAJ_S:-300}
CURL=${CURL:-curl}
NODE=${NODE:-node}
ORK=${ORK:-/data/orkiestrator-klient/klient/orkiestrator.mjs}
KONF=${KONF:-/data/hacknation.json}
TOKEN_PLIK=${TOKEN_PLIK:-/data/.coolify-hacknation}
PANEL=${PANEL:-https://panel.ksefbot.pl}
LOG=${LOG:-/tmp/usluga21.log}
export ORKIESTRATOR_SSH_OMEN=${ORKIESTRATOR_SSH_OMEN:--i /data/.ssh/omen_hackathon hackathon@192.168.1.112}

zdrowa() { $CURL -s -m 5 "$OMEN_URL/zdrowie" 2>/dev/null | grep -q '"ok": *true'; }

# 1. usługa na karcie
if zdrowa; then
  echo "usługa: działa ($OMEN_URL)"
else
  echo "usługa: śpi — zlecenie na kartę OMENa (gpu-tlo, bezczynność $BEZCZYNNOSC min), dziennik $LOG"
  nohup $NODE "$ORK" uruchom --maszyna omen --klasa gpu-tlo --rdzenie 2 --sesja pawel21-usluga --repo hacknation \
    --konto hackathon --ssh --wyslij "$KLON" -- sh -c ". ~/venv/bin/activate && PYTHONPATH=src:. python -m usluga.serwer --host 0.0.0.0 --bezczynnosc $BEZCZYNNOSC" \
    > "$LOG" 2>&1 &
  t=0
  until zdrowa; do
    t=$((t + 5)); [ "$t" -gt "$CZEKAJ_S" ] && { echo "BŁĄD: usługa nie wstała w $CZEKAJ_S s — tail $LOG:"; tail -5 "$LOG"; exit 1; }
    sleep 5
  done
  echo "usługa: działa po ${t} s"
fi
$CURL -s -m 5 "$OMEN_URL/zdrowie"; echo
[ "$TYLKO_USLUGA" = 1 ] && exit 0

# 2. strona w Coolify (tylko za zgodą)
if [ "${POMIN_WDROZENIE:-}" != 1 ]; then
  echo "wdrożenie strony wymaga zgody Pawła: POMIN_WDROZENIE=1 sh wdroz.sh" >&2; exit 2
fi
APP=$($NODE -p "require('$KONF').aplikacja")
TOKEN=$(cat "$TOKEN_PLIK")
api() { $CURL -s -m 30 -X "$1" -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' "$PANEL/api/v1$2" ${3:+-d "$3"}; }
api PATCH "/applications/$APP" "{\"git_branch\":\"$GALAZ\"}" >/dev/null
api POST "/applications/$APP/envs" "{\"key\":\"OMEN_URL\",\"value\":\"$OMEN_URL\"}" >/dev/null || true   # istnieje = 409, zostaje
api PATCH "/applications/$APP/envs" "{\"key\":\"OMEN_URL\",\"value\":\"$OMEN_URL\"}" >/dev/null || true
echo "wdrożenie: $(api GET "/deploy?uuid=$APP&force=false")"

# 3. zdrowie z linku
t=0
until $CURL -s -m 10 "https://$DOMENA/api/zdrowie" 2>/dev/null | grep -q '"ok": *true'; do
  t=$((t + 10)); [ "$t" -gt "$CZEKAJ_S" ] && { echo "BŁĄD: https://$DOMENA/api/zdrowie bez karty ok po $CZEKAJ_S s:"; $CURL -s -m 10 "https://$DOMENA/api/zdrowie"; echo; exit 1; }
  sleep 10
done
echo "z linku: $($CURL -s -m 10 "https://$DOMENA/api/zdrowie")"
