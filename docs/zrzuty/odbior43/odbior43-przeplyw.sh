#!/bin/sh
# Odbiór 43 (Analityk) — 43-4, 43-5, 43-6, 43-7, 43-8, 43-10: zmiana rodzaju, Dodaj jeden obraz, zapis i pobrane pliki
URL=https://hacknation.ksefbot.pl; ZR=/data/hacknation/analityk/docs/zrzuty/odbior43; ROOT=/data/hacknation/analityk
POB=$ZR/pobrane; rm -rf $POB; mkdir -p $POB; B="agent-browser --download-path $POB"
ev() { $B eval "$1"; }
kl() { $B scrollintoview "$1" >/dev/null 2>&1 || true; $B click "$1" >/dev/null; }
agent-browser close >/dev/null 2>&1 || true
$B set viewport 1280 900 >/dev/null
$B open "$URL/" >/dev/null
kl "#start"; kl "#pokazowa"; kl "#policz"
for i in $(seq 90); do [ "$(ev 'S.partia.length===7 && !S.liczy && S.partia.every(a=>a.miejsca||a.zepsuty)')" = "true" ] && break; sleep 2; done
echo "policzone: $(ev 'S.partia.map(a=>a.miejsca?a.miejsca.length:-1).join(",")')"
# detektor ramek: liczba ramek na miniaturze auta n względem miejsc auta
cat > /tmp/det3.js <<'JS'
(n)=>{const a=S.partia[n-1],i=document.querySelector(`#r-wiersze tr[data-auto="${n}"] img.rmini`);const c=document.createElement("canvas");c.width=i.naturalWidth;c.height=i.naturalHeight;const g=c.getContext("2d");g.drawImage(i,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let px=0;for(let j=0;j<d.length;j+=4)if(Math.abs(d[j]-224)<8&&Math.abs(d[j+1]-138)<8&&d[j+2]<8)px++;
const col=(x,y)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=c.width||y>=c.height)return false;const k=(y*c.width+x)*4;return Math.abs(d[k]-224)<30&&Math.abs(d[k+1]-138)<30&&d[k+2]<40};
const sx=c.width/a.szer,sy=c.height/a.wys;let ok=0;a.miejsca.forEach(m=>{const x0=m.x0*sx,y0=m.y0*sy,w=(m.x1-m.x0)*sx,h=(m.y1-m.y0)*sy;let hit=0,tot=0;for(let t=0;t<=1;t+=0.05)for(const [px2,py] of [[x0+t*w,y0],[x0+t*w,y0+h],[x0,y0+t*h],[x0+w,y0+t*h]]){tot++;let f=false;for(let dx=-2;dx<=2&&!f;dx++)for(let dy=-2;dy<=2&&!f;dy++)if(col(px2+dx,py+dy))f=true;if(f)hit++}if(hit/tot>0.8)ok++});
return n+": miejsc="+a.miejsca.length+" ramek_na_miniaturze="+ok+" pikseli_ramek="+px+" rodzaj_op="+(a.rodzajOperatora||"")+" rodzaj="+a.rodzaj+" stan="+a.stan}
JS
DET="($(cat /tmp/det3.js))"
lista() { if [ "$(ev '$("E7").classList.contains("on")')" = "true" ]; then kl "#r-lista"; else kl "#dolisty"; fi; }
rap() { kl "#doraportu"; for i in $(seq 40); do [ "$(ev '[...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.complete&&i.naturalWidth>0).length===S.partia.filter(a=>!a.zepsuty).length')" = "true" ] && break; sleep 0.3; done; }
# wcześniej: decyzja w aucie 7 (ma zniknąć po zmianie), 43-4
kl '#p-wiersze tr[data-i="6"]'; kl "#a-dec button.ok"
lista; rap; echo "przed zmianą  $(ev "$DET(7)")"; 
lista 2>/dev/null; kl '#p-wiersze tr[data-i="6"]'
kl "#zmienrodz"; kl '#z-rodz input[value="kontener"]'
for i in $(seq 20); do [ "$(ev '["z-w0","z-w1"].every(i=>$("z-w0")&&$(i).complete&&$(i).naturalWidth>0)')" = "true" ] && break; sleep 1; done
kl "#z-zast"; for i in $(seq 60); do [ "$(ev '!S.liczy && $("E4").classList.contains("on")')" = "true" ] && break; sleep 1; done
lista; rap; echo "po kontenerze $(ev "$DET(7)")"
$B scrollintoview '#r-wiersze tr[data-auto="7"]' >/dev/null 2>&1; $B screenshot $ZR/43-4-auto7-kontener.png >/dev/null
# powrót na firankę
lista; kl '#p-wiersze tr[data-i="6"]'; kl "#zmienrodz"; kl '#z-rodz input[value="firanka"]'; sleep 1; kl "#z-zast"
for i in $(seq 60); do [ "$(ev '!S.liczy && $("E4").classList.contains("on")')" = "true" ] && break; sleep 1; done
lista; rap; echo "po firance   $(ev "$DET(7)")"
# cysterna na aucie 7
lista; kl '#p-wiersze tr[data-i="6"]'; kl "#zmienrodz"; kl '#z-rodz input[value="cysterna"]'; sleep 1; kl "#z-zast"; sleep 2
lista; rap; echo "po cysternie  $(ev "$DET(7)"); napis: $(ev 'document.querySelector("#r-wiersze tr[data-auto=\"7\"]").textContent.includes("brak wzorca")')"
$B scrollintoview '#r-wiersze tr[data-auto="7"]' >/dev/null 2>&1; $B screenshot $ZR/43-4-auto7-cysterna.png >/dev/null
# stan końcowy: auto 7 = kontener
lista; kl '#p-wiersze tr[data-i="6"]'; kl "#zmienrodz"; kl '#z-rodz input[value="kontener"]'; sleep 1; kl "#z-zast"
for i in $(seq 60); do [ "$(ev '!S.liczy && $("E4").classList.contains("on")')" = "true" ] && break; sleep 1; done
kl "#a-dec button.ok"
# 43-7: Dodaj jeden obraz
lista
$B upload "#plik1" "$ROOT/dane/mini/badany_mini_chlodnia_czyste_00.bmp" >/dev/null
for i in $(seq 60); do [ "$(ev 'S.partia.length===8 && !S.liczy')" = "true" ] && break; sleep 1; done
echo "auto 8: $(ev 'S.partia.length+" aut; auto8 stan="+S.partia[7].stan+", miejsc="+(S.partia[7].miejsca||[]).length')"
# 43-10 czas otwarcia raportu w stronie
kl "#doraportu"
echo "czas miniatur w stronie (ms, 8 aut): $(ev 'new Promise(r=>{const t=performance.now();rysujE7();const w=()=>{if([...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.src.startsWith("data:")).length===8)r(Math.round(performance.now()-t));else setTimeout(w,5)};w()})')"
echo "$(ev "$DET(1)")"; echo "$(ev "$DET(7)")"; echo "$(ev "$DET(8)")"; echo "$(ev "$DET(6)")"
echo "wiersze raportu: $(ev '[...document.querySelectorAll("#r-wiersze tr")].length')"
N0=$(ev 'performance.getEntriesByType("resource").filter(e=>/partia-pokazowa|analiza/.test(e.name)).length')
$B scrollintoview '#r-wiersze tr[data-auto="8"]' >/dev/null 2>&1; $B screenshot $ZR/43-7-auto8.png >/dev/null
T0=$(date +%s%N)
kl "#zapisz"; [ "$($B is visible '#mimo')" = "true" ] && { $B screenshot $ZR/43-5-ostrzezenie.png >/dev/null; kl "#mimo"; }
for i in $(seq 40); do [ -f $POB/raport-partii.html ] && break; sleep 0.25; done
T1=$(date +%s%N); echo "zapis → są 3 pliki: $(( (T1-T0)/1000000 )) ms (z narzutem narzędzia); zapytania liczące po zapisie: $(ev 'performance.getEntriesByType("resource").filter(e=>/partia-pokazowa|analiza/.test(e.name)).length') (przed: $N0)"
ls -l $POB
$B screenshot $ZR/43-5-po-zapisie.png >/dev/null
