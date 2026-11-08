# Raport testów — Przybornik

## Wydanie przybornik-gpt, 8 listopada 2026

Strona została opublikowana w Cloudflare Workers. [Otwórz Przybornik](https://przybornik-gpt.rozni-bliscy.workers.dev/)

- 56 testów Node.js i po 11 kontroli przeglądarkowych w katalogu głównym oraz w podkatalogu zakończyło się pomyślnie.
- Sprawdzono wszystkie siedem narzędzi. Usuwanie metadanych odrzuciło dwa uszkodzone PNG. Otworzono pobrany JPG i zweryfikowano oba archiwa ZIP oraz liczbę klatek obrazów animowanych.
- Kalkulator odrzucił błędny wynik pośredni, konwerter zablokował kopiowanie bez wyniku, zegary zachowały fokus przy aktualizacji, a Pomodoro ukończyło sesję i poprawnie obsłużyło ponowny start.
- Zmierzono osiem ekranów przy szerokościach 320, 375, 390 i 768 px. W żadnej z 32 prób nie było przewijania w poziomie.
- Sprawdzono aktualizację Service Workera i ponowne otwarcie obu ścieżek po zatrzymaniu statycznego serwera. Na publicznym adresie potwierdzono ładowanie strony i poprawki kalkulatora oraz konwertera.
- Testy wykonano w Chrome na komputerze. Instalacja na telefonie, dźwięk, polska mowa i powiadomienia systemowe pozostają do weryfikacji na urządzeniu.

## Wyniki pierwszego przeglądu

Data: 8 listopada 2026, strefa Europe/Warsaw. Testowana przeglądarka: lokalne Chromium w środowisku roboczym. Brak publikacji GitHub Pages i Sites zgodnie z ostatnią dyspozycją użytkownika.

## Wykonane kontrole

| Obszar | Faktyczny wynik |
| --- | --- |
| Testy automatyczne Node.js | **53/53 zaliczone**, 0 błędów, 0 pominiętych |
| Czysta instalacja `npm ci` | Powodzenie; zero zależności do pobrania |
| `npm run build` | Powodzenie; produkcyjny `dist`, wersjonowany Service Worker |
| `node --check` | Poprawna składnia wszystkich czterech modułów JS i SW |
| Audyt zależności `npm audit --offline` | 0 podatności, projekt nie ma zależności npm |
| Kalkulator w testach | Priorytety, nawiasy, prawostronne potęgowanie, minus jednoargumentowy, %, funkcje, DEG/RAD, błędne dane i limit długości |
| Kalkulator w UI | Wpisano klawiaturą `sqrt(81)+2^3`, Enter: **17**; wynik pojawił się też w historii |
| Konwerter w testach | Wszystkie 8 kategorii i odwrotne konwersje dla każdej pary jednostek, temperatura, dane cyfrowe |
| Konwerter w UI | 1 mm → 0,1 cm; przycisk zamiany: 1 cm → 10 mm |
| Hasła w testach | 250 różnych haseł, długość, obecność każdej grupy, wykluczone znaki; odrzucanie błędnych ustawień |
| Hasła w UI | Widoczne hasło, wskaźnik siły; generowanie kolejnego działało po zatrzymaniu lokalnego serwera |
| Strefy w testach | Warszawa lato/zima, nieistniejąca godzina 29.03.2026, dwie godziny 25.10.2026, offset półgodzinny, błędna data |
| Strefy w UI | Działające zegary Warszawa/Londyn/Nowy Jork/Tokio; wyszukanie Berlina; przeliczenie daty na cztery ulubione strefy |
| Pomodoro w testach | Pozostały czas liczony z deadline; przypadek wznowienia po przekroczeniu terminu |
| Pomodoro w UI | Ustawiono 1 minutę, uruchomiono; sesja doszła do **00:00**, licznik sesji wyniósł **1**; przejście do przerwy 5 minut, odliczanie, pauza i reset do 05:00 |
| Metadane w testach | JPG, progresywny JPG, PNG, WebP, APNG i animowany WebP: usunięcie danych testowych, zgodność wymiarów, idempotencja; odrzucanie nieobsługiwanych/uszkodzonych danych |
| Niezależna weryfikacja zdjęć (Python Pillow) | Dla wszystkich sześciu plików: brak EXIF, XMP, profilu ICC, komentarzy i tekstu testowego; identyczne zdekodowane piksele pierwszej klatki i zachowana liczba klatek |
| ZIP w testach | CRC32 według standardowego wektora; niezależny Python `zipfile.testzip()` bez błędów; poprawna nazwa `żółć.txt` oraz 7 plików w archiwum |
| Testy przeglądarkowe Canvas/PWA | **11/11 zaliczone**: 9 konwersji (JPG/PNG/WebP × JPG/PNG/WebP), dekodowanie wyników, skalowanie do 32 px, proporcje i orientacja JPEG, brak usuwanych bloków metadanych; aktywny SW; komplet cache |
| Manifest i ikony | Testy sprawdziły `start_url`, `scope`, ikony 192/512 i maskable dla `/przybornik/` |
| Offline | Zatrzymano lokalny serwer; otwarto aplikację ponownie z innej strony testowej oraz odświeżono ją. Aplikacja załadowała się z cache, generator haseł i pozostałe sprawdzane narzędzia działały |
| Aktualizacja PWA | Uruchomiono serwer z nowym buildem; pojawił się komunikat „Nowa wersja jest gotowa”; po użyciu przycisku odświeżenia załadowano nową wersję z widoczną zmienioną treścią |
| Motywy | Ręcznie przełączono i oceniono wygląd jasny i ciemny |
| Responsywność | Oceniono pełny układ desktopowy oraz wąski układ przez zoom 300%/400% w Chromium (około 450/340 px szerokości CSS); poprawne przejście do jednej kolumny. To nie jest test fizycznego Androida |
| Klawiatura | Wpisywanie wyrażenia i Enter w kalkulatorze; widoczny fokus pola |
| Workflow | Sprawdzona obecność oficjalnych akcji Pages; test potwierdza wyłącznie ręczny wyzwalacz, bez automatycznej publikacji po push |

## Kontrole niepotwierdzone lub niewykonane

- Nie wykonano testu na fizycznym Androidzie, Chrome mobilnym ani innych przeglądarkach.
- Nie przeprowadzono rzeczywistej instalacji PWA na Androidzie ani PC. Manifest, SW i offline zostały przetestowane; nie oznacza to potwierdzenia całego procesu instalacyjnego.
- Nie potwierdzono odsłuchu sygnału dźwiękowego, polskiej mowy ani dostarczenia powiadomienia systemowego. Odpowiednie API są zaimplementowane; Android może opóźniać ich działanie w tle.
- Wybór pliku przez okno systemowe przeglądarki był ograniczony przez środowisko automatyzacji. Faktyczną kompresję sprawdzono w Chromium przez lokalny harness testowy z syntetycznymi zdjęciami, bez udawania pełnego testu drag & drop lub systemowego pickera Androida.
- Uruchomiono przycisk pobierania ZIP w harnessie przeglądarkowym, ale nie uzyskano potwierdzenia ukończenia zapisu pliku przez środowisko pobierania. Struktura i integralność ZIP zostały niezależnie zweryfikowane w testach plikowych. Pełny przepływ pobierania pojedynczego pliku/partii w docelowym urządzeniu pozostaje do sprawdzenia.
- Nie wykonano pełnego audytu czytnikiem ekranu ani automatycznego audytu WCAG. Interfejs ma etykiety, semantyczne przyciski, fokus klawiatury i komunikaty live.
- Nie wykonano statycznego sprawdzania TypeScript (`tsc` jest niedostępny); build usuwa składnię typów przez Node i sprawdza działające moduły.
- Nie uzyskano dostępu do referencyjnej strony Lovable; nie deklaruje się kompletnej analizy jej niewidocznych ustawień.
- Nie utworzono zdalnego repozytorium na GitHub ani wdrożenia. Konto nie jest zalogowane w CLI, a ostatnia instrukcja użytkownika przewiduje samodzielne wgranie kodu później. Utworzono repozytorium lokalne w gałęzi `main`.
- Nie uruchomiono workflow w GitHub Actions. Automatyczne wdrażanie pozostaje **wyłączone**. README zawiera sposób późniejszego włączenia `push` na `main`.

## Jak powtórzyć kontrole

`npm ci`, `npm test`, `npm run build`. Po uruchomieniu produkcyjnego podglądu `npm run dev`, odwiedź główną stronę, aby zainstalować SW. `node scripts/browser-check.mjs` dodaje lokalną stronę testową `/przybornik/browser-check.html` do `dist`. Następny `npm run build` usuwa harness z gotowej paczki.

Syntetyczne pliki testowe są w `tests/fixtures`. Wyniki testów plikowych trafiają do ignorowanego `tests/output`. Kod nie wymaga żadnego połączenia z płatną usługą ani zewnętrznym API.
