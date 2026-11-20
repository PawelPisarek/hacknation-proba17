#!/bin/sh
# Test wdroz.sh bez sieci i bez maszyn: składnia, odmowa wdrożenia bez zgody, --usluga przy żywej usłudze nie zleca nic.
set -eu
cd "$(dirname "$0")/../.."
T=$(mktemp -d)
bad() { echo "FAIL: $*"; exit 1; }
sh -n wdroz.sh || bad "składnia"
printf '#!/bin/sh\necho "{\\"ok\\": true}"\n' > "$T/curl"; chmod +x "$T/curl"
printf '#!/bin/sh\necho "NODE $*" >> %s/node.log\n' "$T" > "$T/node"; chmod +x "$T/node"
set +e
CURL="$T/curl" NODE="$T/node" sh wdroz.sh > "$T/a.out" 2>&1; k=$?
set -e
[ "$k" = 2 ] || bad "bez POMIN_WDROZENIE kod $k (oczekiwane 2): $(cat $T/a.out)"
grep -q "POMIN_WDROZENIE" "$T/a.out" || bad "brak komunikatu o zgodzie"
[ ! -f "$T/node.log" ] || bad "przy żywej usłudze nie powinno być zlecenia ani Coolify: $(cat $T/node.log)"
CURL="$T/curl" NODE="$T/node" sh wdroz.sh --usluga > "$T/b.out" 2>&1 || bad "--usluga przy żywej usłudze: $(cat $T/b.out)"
grep -q "usługa: działa" "$T/b.out" || bad "brak meldunku usługi"
set +e; sh wdroz.sh --zla > /dev/null 2>&1; k=$?; set -e
[ "$k" = 64 ] || bad "nieznana opcja kod $k"
echo "OK test_wdroz"
