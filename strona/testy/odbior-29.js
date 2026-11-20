// Zadanie 29 — testy A6, A9, A11, A13 na żywej stronie (w przeglądarce, po wczytaniu /?partia=1&auto=1 i policzeniu partii).
// Uruchomienie: agent-browser open "https://hacknation.ksefbot.pl/?partia=1&auto=1"; agent-browser eval "$(cat strona/testy/odbior-29.js)"
// Wynik: JSON {A6, A9, A11, A13: "ok" | "BŁĄD: …", raport: {json, csv}}.
(async () => {
  const $ = (i) => document.getElementById(i);
  const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let t = 0; t < 600 && (S.liczy || !$("E4").classList.contains("on")); t++) await czekaj(500);
  const wynik = {}, sprawdz = (k, warunek, opis) => { if (!(k in wynik)) wynik[k] = warunek ? "ok" : "BŁĄD: " + opis; else if (!warunek) wynik[k] = "BŁĄD: " + opis; };
  const pliki = {}; pobierz = (n, t) => { pliki[n] = t; };   // zapis raportu przechwycony zamiast pobierania
  const przycisk = (txt) => [...$("a-dec").querySelectorAll("button")].find((b) => b.textContent === txt);
  const a = A();
  // A6: zatwierdzenie jednym kliknięciem; odrzucenie tylko z powodem z listy P13 (+ „inny” z tekstem)
  const opcje = [...$("a-dec").querySelectorAll("select option")].map((o) => o.textContent).slice(1);
  sprawdz("A6", JSON.stringify(opcje) === JSON.stringify(POWODY), "lista powodów " + JSON.stringify(opcje));
  przycisk("Zatwierdź").click();
  sprawdz("A6", a.decyzje[0]?.d === "zatwierdzone", "zatwierdzenie jednym kliknięciem");
  const sel = $("a-dec").querySelector("select"); sel.value = "nakładanie się ładunku"; sel.onchange();
  sprawdz("A6", a.decyzje[1]?.d === "odrzucone" && a.decyzje[1].powod === "nakładanie się ładunku", "odrzucenie z powodem");
  const sel2 = $("a-dec").querySelector("select"); sel2.value = "inny"; sel2.onchange();
  const inny = $("a-dec").querySelector("input"); inny.value = "pusta paleta"; inny.onkeydown({ key: "Enter" });
  sprawdz("A6", a.decyzje[2]?.powod === "pusta paleta", "powód „inny” z tekstem");
  while (a.miejsca.some((_, j) => !a.decyzje[j])) przycisk("Zatwierdź").click();
  // A9: bez nr rej. auto się nie zamyka (pole alarmu + napis), z numerem — przechodzi dalej
  sprawdz("A9", $("E4").classList.contains("on") && S.ia === a.id - 1 && $("a-nr").classList.contains("alarm") && $("a-nrinfo").textContent.includes("Nr") === false && $("a-nrinfo").textContent.length > 0, "auto bez nr rej. nie zamknięte");
  $("a-nr").value = "wgm 12345"; $("a-nr").oninput(); $("a-nr").onkeydown({ key: "Enter" });
  sprawdz("A9", a.zamkniete && a.nr === "WGM 12345" && S.ia !== a.id - 1, "z nr rej. auto zamknięte i następne otwarte");
  // A13: zmiana decyzji w poprzednim aucie z listy partii
  $("dolisty").onclick(); $("p-wiersze").querySelector(`tr[data-i="${a.id - 1}"]`).onclick();
  wybierz(0); const s3 = $("a-dec").querySelector("select"); s3.value = "element konstrukcji"; s3.onchange();
  sprawdz("A13", a.decyzje[0]?.d === "odrzucone" && a.decyzje[0].powod === "element konstrukcji", "zmiana decyzji z listy");
  // A11: raport z polami P18, ostrzeżenie o autach bez decyzji, zapis .json i .csv jednym przyciskiem, partia zamknięta
  $("dolisty").onclick(); $("doraportu").onclick(); $("zapisz").onclick();
  sprawdz("A11", /Brak decyzji: auto/.test($("r-ostrz").innerText), "ostrzeżenie z listą aut bez decyzji");
  $("mimo").onclick();
  const r = JSON.parse(pliki["raport-partii.json"] || "[]"), r1 = r.find((x) => x.auto === a.id) || {};
  const pola = ["id_kontroli", "auto", "plik", "nr_rej", "rodzaj_programu", "rodzaj_operatora", "liczba_miejsc", "decyzje", "kto", "miejsce_kontroli", "data_godzina"];
  sprawdz("A11", pola.every((p) => p in r1), "pola P18 " + JSON.stringify(Object.keys(r1)));
  sprawdz("A11", r1.nr_rej === "WGM 12345" && r1.kto && r1.kto !== "—" && r1.data_godzina !== "—" && r1.decyzje.length === a.miejsca.length, "wartości auta z decyzjami");
  sprawdz("A11", r.filter((x) => x.auto !== a.id && x.liczba_miejsc > 0).every((x) => x.data_godzina === "—"), "auto bez decyzji: data „—” (P64 A)");
  sprawdz("A11", (pliki["raport-partii.csv"] || "").split("\n")[0].includes("id_kontroli;auto;plik;nr_rej"), "csv");
  sprawdz("A13", S.zamknieta && $("r-nowa").style.display === "", "po zapisie partia zamknięta, „Nowa partia”");
  $("r-lista").onclick();
  sprawdz("A13", [...$("p-wiersze").querySelectorAll("tr")].every((t) => !t.classList.contains("klik")) && /rozstrzygnięte/.test($("p-wiersze").innerText), "po zamknięciu wiersze „rozstrzygnięte”, bez zmian");
  return JSON.stringify({ ...wynik, raport: pliki });
})()
