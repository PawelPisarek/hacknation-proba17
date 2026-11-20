#!/bin/sh
# Odbiór 43 (Analityk) — 43-1…43-6, 43-9, 43-10 na żywym linku; okno $1 px
URL=https://hacknation.ksefbot.pl; W=${1:-1280}; ZR=/data/hacknation/analityk/docs/zrzuty/odbior43
POB=$(mktemp -d); B="agent-browser --download-path $POB"
ev() { $B eval "$1"; }
kl() { $B scrollintoview "$1" >/dev/null 2>&1 || true; $B click "$1" >/dev/null; }
agent-browser close >/dev/null 2>&1 || true
$B set viewport $W 900 >/dev/null
$B open "$URL/" >/dev/null
kl "#start"; kl "#pokazowa"; kl "#policz"
for i in $(seq 90); do [ "$(ev 'S.partia.length===7 && !S.liczy && S.partia.every(a=>a.miejsca||a.zepsuty)')" = "true" ] && break; sleep 2; done
echo "policzone: $(ev 'S.partia.map(a=>a.miejsca?a.miejsca.length:-1).join(",")')"
# widok auta 1 i 7: względne ramki z DOM (#obB)
VIEW='((k)=>{const o=document.getElementById("obB").getBoundingClientRect();window.__V=window.__V||{};window.__V[k]=[...document.querySelectorAll("#obB .ramka")].map(r=>{const b=r.getBoundingClientRect();return [(b.left-o.left)/o.width,(b.top-o.top)/o.height,b.width/o.width,b.height/o.height]});return window.__V[k].length})'
kl '#p-wiersze tr[data-i="0"]'; sleep 1
V1=$(ev "($VIEW)(1)"); echo "ramek w widoku auta 1: $V1"
$B screenshot $ZR/43-widok-auto1-$W.png >/dev/null
kl "#dolisty"; kl '#p-wiersze tr[data-i="6"]'; sleep 1
V7=$(ev "($VIEW)(7)"); echo "ramek w widoku auta 7: $V7"
kl "#dolisty"
kl "#doraportu"
N0=$(ev 'performance.getEntriesByType("resource").filter(e=>/partia-pokazowa|analiza/.test(e.name)).length')
T0=$(date +%s%N)
for i in $(seq 60); do [ "$(ev '[...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.complete&&i.naturalWidth>0).length===7')" = "true" ] && break; sleep 0.2; done
T1=$(date +%s%N); echo "czas do 7 miniatur (z narzutem agent-browser): $(( (T1-T0)/1000000 )) ms"
echo "43-1: img z naturalWidth>0: $(ev '[...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.complete&&i.naturalWidth>0).map(i=>i.naturalWidth+"x"+i.naturalHeight).join(",")'); kolejność auto: $(ev '[...document.querySelectorAll("#r-wiersze tr")].map(t=>t.dataset.auto).join(",")')"
echo "43-10 zapytania liczące przy otwarciu raportu: $(ev 'performance.getEntriesByType("resource").filter(e=>/partia-pokazowa|analiza/.test(e.name)).length') (przed: $N0); /api/obraz łącznie: $(ev 'performance.getEntriesByType("resource").filter(e=>/api\/obraz/.test(e.name)).length')"
# 43-2: ramki wykryte na miniaturze (kolor #e08a00): ramka-po-ramce, sprawdzenie górnej krawędzi względem VIEW
cat > /tmp/det43.js <<'JS'
()=>{const V=window.__V,out={};for(const [n,view] of Object.entries(V)){const i=document.querySelector(`#r-wiersze tr[data-auto="${n}"] img.rmini`),c=document.createElement("canvas");c.width=i.naturalWidth;c.height=i.naturalHeight;const g=c.getContext("2d");g.drawImage(i,0,0);const d=g.getImageData(0,0,c.width,c.height).data;const col=(x,y)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=c.width||y>=c.height)return false;const k=(y*c.width+x)*4;return Math.abs(d[k]-224)<30&&Math.abs(d[k+1]-138)<30&&d[k+2]<40};
let ok=0,res=[];view.forEach(v=>{const x0=v[0]*c.width,y0=v[1]*c.height,w=v[2]*c.width,h=v[3]*c.height;let hit=0,tot=0;for(let t=0;t<=1;t+=0.05){for(const [px,py] of [[x0+t*w,y0],[x0+t*w,y0+h],[x0,y0+t*h],[x0+w,y0+t*h]]){tot++;let f=false;for(let dx=-2;dx<=2&&!f;dx++)for(let dy=-2;dy<=2&&!f;dy++)if(col(px+dx,py+dy))f=true;if(f)hit++}}res.push(hit/tot);if(hit/tot>0.8)ok++});out[n]={ramek_widok:view.length,zgodne_z_widokiem:ok,min:Math.min(...res).toFixed(2)}}return JSON.stringify(out)}
JS
echo "43-2: $(ev "($(cat /tmp/det43.js))()")"
$B scrollintoview "#E7 h2" >/dev/null 2>&1 || true
$B screenshot $ZR/43-raport-$W.png >/dev/null
echo "43-3: $(ev '(()=>{const t=document.querySelector("#r-wiersze tr[data-auto=\"6\"]");return t.querySelector("td").textContent.trim()+" | stan: "+t.textContent.replace(/\s+/g," ").slice(0,200)})()')"
echo "43-9: szer. okna $W, scrollWidth tabeli: $(ev 'document.querySelector("#E7 table").scrollWidth') / $(ev 'document.querySelector("#E7 table").parentElement.clientWidth'); kol. Rodzaj programu ucięta: $(ev '(()=>{const th=[...document.querySelectorAll("#E7 th")];const i=th.findIndex(t=>/Rodzaj programu/.test(t.textContent));return [...document.querySelectorAll("#r-wiersze tr")].some(r=>{const c=r.children[i];return c.scrollWidth>c.clientWidth})})()')"
echo "$POB" > /tmp/pob43
