# Przybornik

Siedem bezpłatnych narzędzi w przeglądarce, po polsku. Bez logowania, reklam, analityki i serwera przetwarzającego dane. Zdjęcia oraz hasła pozostają na urządzeniu. Responsywny interfejs ma jasny i ciemny motyw.

**Strona projektu (GitHub Pages): [https://dziurawiec77.github.io/przybornik/](https://dziurawiec77.github.io/przybornik/)**

[Otwórz Przybornik](https://dziurawiec77.github.io/przybornik/) · [Kod źródłowy](https://github.com/dziurawiec77/przybornik)

*Poprzedni adres w Cloudflare Workers może być nieaktualny; głównym adresem jest obecnie GitHub Pages.*

## Funkcje

1. **Usuwanie metadanych** — JPG, PNG, WebP; lokalne usuwanie EXIF, GPS, XMP, komentarzy i profili kolorów bez ponownego kodowania pikseli. Zachowuje animacje APNG/WebP. Podgląd, partie plików, pobieranie wyników i ZIP. Wynik przechodzi ponowną kontrolę strukturalną.
2. **Kompresor obrazów** — JPG/PNG/WebP; jakość, maksymalna szerokość i wysokość z zachowaniem proporcji, wybór formatu, podgląd przed/po, porównanie rozmiarów, procent oszczędności, partie i ZIP.
3. **Strefy czasowe** — zegary, wyszukiwanie stref IANA i popularnych polskich nazw miast, maksymalnie 12 ulubionych stref, przeliczanie dat, czas letni/zimowy. Rozpoznaje godziny nieistniejące i powtórzone. Domyślnie Warszawa i 24 h.
4. **Kalkulator naukowy** — parser bez `eval` i `Function`, kolejność działań, nawiasy, potęgi, procenty, sqrt, ln, log, abs, sin/cos/tan, DEG/RAD, π i e, historia 20 wyników, schowek, klawiatura ekranowa i PC. Enter liczy, Escape czyści. `50% * 200 = 100`; procent jest operatorem dzielenia przez 100.
5. **Konwerter jednostek** — długość, masa, temperatura, powierzchnia, objętość, prędkość, czas i dane cyfrowe. Natychmiastowy wynik, zamiana jednostek, schowek. Rozróżnia jednostki dziesiętne i binarne.
6. **Generator haseł** — Web Crypto z rejection sampling i tasowaniem Fishera–Yatesa, długość 4–128, zestawy znaków, wykluczenia, obecność każdej wybranej grupy, ostrożny wskaźnik siły, kopiowanie. Hasła nie są zapisywane ani logowane.
7. **Pomodoro** — konfigurowalne okresy pracy i przerw, długa przerwa co określoną liczbę sesji, start/pauza/reset, zakończenie i ręczne przejście do kolejnego etapu, licznik sesji, dźwięk, opcjonalna polska mowa i powiadomienia. Czas opiera się na rzeczywistym terminie zakończenia.

## Technologie

TypeScript, HTML, CSS, ES Modules, Canvas, Intl (systemowa baza stref), Web Crypto, Web Audio, Speech Synthesis, Notifications, Service Worker i Cache Storage. Ikony SVG powstały w projekcie. ZIP (STORE z CRC32), parser matematyczny i usuwanie metadanych są implementacjami lokalnymi.

**Brak zależności npm — zarówno wykonawczych, jak i deweloperskich.** Aplikacja korzysta z natywnych interfejsów przeglądarki i prostego skryptu budowania w Node.js. Plik `vite.config.ts` zachowuje prawidłowe `base: '/przybornik/'` dla opcjonalnej migracji. Żadne zasoby nie pochodzą z CDN.

## Uruchomienie lokalne

Wymagany Node.js **22.18+** lub 24 (natywne usuwanie składni TypeScript). Nie ma potrzeby pobierania bibliotek.

```bash
npm ci
npm test
npm run build
npm run dev
```

Otwórz `http://localhost:5173/`. `npm run dev` serwuje produkcyjny katalog `dist`, wraz z Service Workerem. Dla samego podglądu źródeł użyj `npm run dev:source` — wtedy nie testuj PWA. Zmiany źródeł wymagają ponownego `npm run build`. Skrypt budowania usuwa typy; nie wykonuje statycznej kontroli typów TypeScript.

Nie otwieraj `index.html` bezpośrednio przez `file://`. PWA wymaga HTTPS albo lokalnego zaufanego adresu loopback.

## Cloudflare Workers

Publiczna wersja działa w projekcie `przybornik-gpt`. [Otwórz Przybornik](https://przybornik-gpt.rozni-bliscy.workers.dev/)

Po zbudowaniu aplikacji polecenie `node scripts/cloudflare-static.mjs ../przybornik-gpt.mjs` przygotowuje moduł do wgrania w projekcie Workers. Moduł serwuje gotowe pliki z `dist/`, w tym manifest i Service Worker. Narzędzia nadal wykonują obliczenia i przetwarzają zdjęcia w przeglądarce.

## Struktura

- `src/main.ts` — interfejs, nawigacja hash, stan narzędzi.
- `src/core.ts` — obliczenia, jednostki, hasła, strefy i czas.
- `src/images.ts` — przetwarzanie obrazów i pobieranie.
- `src/zip.ts` — ZIP bez zewnętrznych bibliotek.
- `src/style.css` — responsywność i oba motywy.
- `public/` — manifest i ikony 192/512 px, w tym maskable.
- `scripts/build.mjs` — samowystarczalny build i wersjonowanie cache.
- `scripts/sw-template.js` — szablon Service Workera.
- `tests/` — automatyczne testy i syntetyczne zdjęcia testowe.
- `.github/workflows/deploy.yml` — oficjalny mechanizm GitHub Pages.

## GitHub Pages — automatyczna publikacja

Workflow `.github/workflows/deploy.yml` publikuje aplikację po zmianach w gałęzi `main` oraz może zostać uruchomiony ręcznie przez `workflow_dispatch`.

**Przed pierwszą publikacją:** właściciel repozytorium musi skonfigurować **Settings → Pages → Build and deployment → Source: GitHub Actions**. Repozytorium jest obecnie prywatne. Na koncie GitHub Free publikacja Pages wymaga repozytorium publicznego (Settings → General → Danger Zone → Change repository visibility), zaś GitHub Pro wspiera Pages z prywatnego repozytorium. Strona GitHub Pages będzie publicznie dostępna, również przy prywatnym kodzie repozytorium. Nie zmieniaj widoczności bez świadomej decyzji.

Po skonfigurowaniu Pages wybierz **Actions → Publikacja GitHub Pages → Run workflow**. Każda późniejsza zmiana w `main` automatycznie ponowi publikację. Workflow wykonuje `npm ci`, `npm test`, `npm run build`, przesyła `dist` do GitHub Pages i wdraża stronę. Potwierdzony adres będzie widoczny po udanym zadaniu `deploy` i zwykle ma format `https://dziurawiec77.github.io/przybornik/`.

Repozytorium zawiera prawidłowe względne ścieżki zasobów, manifestu i Service Workera; routing hash pozwala odświeżać narzędzia bez reguł przekierowań.

## Aktualizacje

Edytuj `src`, uruchom `npm test` i `npm run build`, sprawdź podgląd, następnie commit/push. Przed włączeniem automatyki uruchamiaj workflow ręcznie. Cache otrzymuje identyfikator z hasha plików. Nowy worker czeka; aplikacja pokazuje przycisk odświeżenia, żeby nie przerywać pracy ze zdjęciami. Po jego użyciu stary cache aplikacji jest usuwany.

## Instalacja PWA

### Android

Po publikacji otwórz stronę przez HTTPS w aktualnym Chrome. Poczekaj na pierwsze pełne załadowanie. Użyj „Zainstaluj aplikację”, jeśli przycisk się pojawi, albo menu Chrome → „Dodaj do ekranu głównego” / „Zainstaluj aplikację”. Nazwy zależą od wersji przeglądarki. Później otwieraj Przybornik z ikony.

### Komputer

W Chrome lub Edge użyj ikony instalacji na pasku adresu, przycisku aplikacji lub odpowiedniej opcji w menu przeglądarki. Nie każda przeglądarka obsługuje instalację PWA. W takim przypadku narzędzia nadal działają jako strona.

### Offline

Po pierwszym poprawnym załadowaniu produkcyjnej wersji Service Worker zapisuje HTML, moduły, CSS, manifest i ikony. Lokalne narzędzia działają bez internetu. Usunięcie danych witryny lub automatyczne czyszczenie pamięci przez system wymaga ponownego załadowania online. Aktualizacje wymagają połączenia z internetem.

## Prywatność i bezpieczeństwo

- Brak fetchy do usług zewnętrznych, reklam, statystyk i cookies aplikacyjnych.
- `localStorage` przechowuje motyw, ulubione strefy, ustawienia Pomodoro i historię kalkulatora; hasła i zdjęcia nie są tam zapisywane.
- Zdjęcia w pamięci są zwalniane po wyczyszczeniu lub opuszczeniu narzędzia; adresy Blob są odwoływane. Pobrane pliki są zapisywane przez użytkownika.
- Limity: 20 plików, 25 MB na plik, 100 MB wejściowej partii, 100 MB wyników, 40 megapikseli i maksymalnie 20000 px boku; sekwencyjne przetwarzanie ogranicza skoki zużycia pamięci. Słaby telefon może potrzebować mniejszych partii.
- Wymiary i format są sprawdzane przed dekodowaniem; HTML, SVG oraz pliki podszywające się samym rozszerzeniem są odrzucane.
- Dane użytkownika wstawiane do HTML są escapowane; CSP ogranicza skrypty i połączenia do własnego źródła.
- Audyt npm: drzewo bez zależności, 0 wykrytych podatności. To nie zastępuje pełnego zewnętrznego audytu bezpieczeństwa kodu.

## Testy

```bash
npm test
npm run build
node scripts/browser-check.mjs
npm run dev
```

Po odwiedzeniu głównej strony otwórz lokalne `/browser-check.html`. Strona testowa powstaje wyłącznie w `dist` i jest usuwana przez następny build. Nie publikuj wersji z tą stroną. Testuje dziewięć konwersji Canvas (3 wejścia × 3 wyjścia), wymiary, proporcje, orientację JPG, możliwość dekodowania i brak usuwanych metadanych, a także aktywnego SW i cache. Można z niej uruchomić pobieranie testowego ZIP.

Szczegółowy, uczciwy wykaz wykonanych oraz niewykonanych kontroli zawiera `RAPORT_TESTOW.md`.

## Znane ograniczenia

- Nie przeprowadzono weryfikacji zgodności ze stroną referencyjną: środowisko nie uzyskało do niej dostępu. Implementacja opiera się na przekazanej specyfikacji.
- Usuwanie metadanych usuwa również orientację EXIF oraz profile kolorów. Może zmienić obrót/prezentację kolorów, choć nie koduje ponownie pikseli. Nie usuwa informacji widocznych w obrazie ani ukrytych w samych pikselach (steganografia).
- Kontrola metadanych dotyczy struktury formatów i testowych plików; nie stanowi gwarancji wykrycia dowolnego nietypowego nośnika informacji. Uszkodzone lub nietypowe pliki mogą zostać odrzucone.
- Kompresor ponownie koduje obraz, usuwa animację, może zmienić kolory i jakość. Dla PNG suwak jakości nie ma efektu. JPG zastępuje przezroczystość białym tłem. Małe pliki mogą po przetworzeniu zwiększyć rozmiar.
- JavaScript używa liczb zmiennoprzecinkowych: obliczenia nie są przeznaczone do księgowości ani dowodów matematycznych; wynik wyświetlany jest do 14 cyfr znaczących.
- Reguły stref pochodzą z przeglądarki/systemu. Nieaktualny system może mieć stare przepisy. Popularne miasta mają polskie aliasy; pozostałe strefy korzystają z nazw IANA. Natywny wybór daty i plików może podlegać językowi/formatowi przeglądarki.
- Pomodoro nadrabia upływ czasu po wznowieniu, ale Android może opóźnić sygnał, mowę lub powiadomienie. Aplikacja nie uruchamia kolejnych etapów bez kliknięcia; zamknięcie/odświeżenie kończy odliczanie i zeruje licznik sesji. Zapisywane są ustawienia.
- Mowa wymaga dostępnego polskiego głosu; powiadomienia wymagają zgody i wspieranej przeglądarki. Schowek wymaga bezpiecznego kontekstu i może być blokowany przez politykę urządzenia.
- Nie zweryfikowano fizycznego Androida, rzeczywistej instalacji PWA i publikacji GitHub Pages. Publikacja pozostaje wyłączona zgodnie z życzeniem właściciela.

## Licencja

MIT — patrz `LICENSE`. Obrazy testowe są syntetyczne, bez danych osobowych.
