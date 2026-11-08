# PROJEKT: PRZYBORNIK — KOMPLETNA APLIKACJA WEBOWA PWA Z AUTOMATYCZNĄ PUBLIKACJĄ NA GITHUB PAGES
 
## 1. GŁÓWNE ZADANIE
 
Twoim zadaniem jest samodzielne zaprojektowanie, napisanie, przetestowanie i opublikowanie kompletnej aplikacji internetowej o nazwie **Przybornik**.
 
Aplikacja ma stanowić zestaw praktycznych narzędzi dostępnych przez przeglądarkę na komputerach PC i urządzeniach mobilnych z Androidem.
 
**Strona referencyjna:** https://pocket-pixel-time-toolkit.lovable.app/
 
Otwórz i dokładnie przeanalizuj stronę referencyjną. Zidentyfikuj wszystkie dostępne narzędzia, ich funkcje, ustawienia i sposób działania.
 
Nie kopiuj kodu ani wyglądu strony. Stwórz własny, nowoczesny interfejs, ale zachowaj pełną funkcjonalność wszystkich siedmiu narzędzi.
 
**Najważniejszy wymóg: nie kończ pracy na makiecie, projekcie ani kodzie źródłowym. Twoim celem jest rzeczywiście działająca aplikacja opublikowana w internecie na GitHub Pages.**
 
## 2. GITHUB — REPOZYTORIUM I PUBLIKACJA
 
Korzystaj wyłącznie z GitHub oraz GitHub Pages. Nie używaj Cloudflare, Vercel, Netlify ani innych zewnętrznych hostingów.
 
### Dostęp do konta
 
Wykorzystaj konto GitHub, które jest podłączone i autoryzowane w aktualnym środowisku ChatGPT Work.
 
Nie twórz nowego konta GitHub.
 
Jeżeli połączenie z GitHub nie jest aktywne, poproś o jego autoryzację i kontynuuj pracę po uzyskaniu dostępu.
 
### Utworzenie repozytorium
 
1. Sprawdź, do jakiego konta GitHub masz dostęp.
2. Utwórz na tym koncie nowe publiczne repozytorium o nazwie `przybornik`.
3. Jeżeli takie repozytorium już istnieje, nie nadpisuj go automatycznie. Sprawdź jego zawartość i wybierz bezpieczne rozwiązanie.
4. Dodaj kompletny kod aplikacji.
5. Dodaj plik README.md z dokumentacją po polsku.
6. Dodaj .gitignore i pozostałe niezbędne pliki konfiguracyjne.
7. Umieść kod w gałęzi `main`.
8. Wykonaj commit i push do GitHub.

 
### GitHub Pages
 
Samodzielnie skonfiguruj i uruchom GitHub Pages.
 
Wymagania:
 
- Darmowy hosting GitHub Pages.
- Automatyczne wdrażanie przez GitHub Actions.
- HTTPS.
- Poprawne działanie pod adresem `https://NAZWA-KONTA.github.io/przybornik/`.
- Prawidłowa konfiguracja Vite `base`.
- Prawidłowe ścieżki do zasobów, ikon, manifestu i Service Workera.
- Poprawna obsługa odświeżania i nawigacji.
- Automatyczna publikacja kolejnych zmian po aktualizacji gałęzi `main`.

 
Utwórz działający workflow:
 
`.github/workflows/deploy.yml`
 
Workflow powinien instalować zależności, budować aplikację i publikować katalog `dist` przez oficjalne mechanizmy GitHub Pages.
 
Ustaw wymagane uprawnienia workflow i konfigurację środowiska GitHub Pages.
 
**Nie poprzestawaj na przygotowaniu workflow. Uruchom publikację, sprawdź jej wynik i otwórz publiczny adres strony.**
 
Jeśli konto lub środowisko wymaga mojego zatwierdzenia operacji, poproś o nie. Po zatwierdzeniu kontynuuj realizację.
 
## 3. TECHNOLOGIE
 
Preferowany stos technologiczny:
 
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- PWA.
- Service Worker.
- GitHub Actions.
- GitHub Pages.

 
Możesz wykorzystać sprawdzone biblioteki open source.
 
Nie korzystaj z płatnych API, usług wymagających subskrypcji, serwerów backendowych ani baz danych.
 
Cała aplikacja powinna działać po stronie użytkownika.
 
## 4. NARZĘDZIA — PEŁNA IMPLEMENTACJA
 
### NARZĘDZIE 1: Usuwanie metadanych zdjęć
 
Zaimplementuj:
 
- Obsługę JPG, PNG i WebP.
- Usuwanie EXIF, informacji GPS i pozostałych metadanych, których usunięcie jest technicznie możliwe.
- Przetwarzanie pojedynczych zdjęć i wielu plików jednocześnie.
- Drag &amp; Drop na komputerze.
- Wybór plików na Androidzie.
- Podgląd obrazów.
- Informację o rozmiarze pliku.
- Pobieranie oczyszczonych zdjęć.
- Pobieranie wielu plików jako ZIP.
- Lokalną obróbkę bez wysyłania zdjęć na serwer.

 
Zadbaj o zachowanie możliwie wysokiej jakości. Wyraźnie informuj, gdy ponowne kodowanie może zmienić jakość, profil kolorów, animację lub inne właściwości obrazu.
 
Zweryfikuj wynikowe pliki pod kątem pozostałych metadanych.
 
### NARZĘDZIE 2: Kompresor obrazów
 
Funkcje:
 
- Obsługa JPG, PNG i WebP.
- Kompresja lokalna.
- Regulacja jakości.
- Zmiana rozdzielczości.
- Zachowanie proporcji obrazu.
- Podgląd przed i po.
- Porównanie rozmiarów plików.
- Wyświetlanie procentowej oszczędności.
- Kompresja wielu zdjęć.
- Pobieranie pojedynczych wyników i archiwum ZIP.

 
Interfejs powinien być wygodny zarówno na komputerze, jak i na telefonie.
 
### NARZĘDZIE 3: Strefy czasowe
 
Funkcje:
 
- Aktualny czas w wybranych miastach.
- Wyszukiwanie stref czasowych.
- Porównywanie kilku stref.
- Przeliczanie wybranej daty i godziny.
- Automatyczne uwzględnianie zmian czasu letniego i zimowego.
- Możliwość zapisywania ulubionych stref.

 
Domyślne ustawienia:
 
- Polska.
- Europe/Warsaw.
- Format 24-godzinny.
- Polskie nazwy i komunikaty.

 
Korzystaj z systemowej bazy stref czasowych dostępnej przez standardowe API przeglądarki lub odpowiednie biblioteki.
 
### NARZĘDZIE 4: Kalkulator naukowy
 
Zaimplementuj:
 
- Dodawanie, odejmowanie, mnożenie i dzielenie.
- Procenty.
- Potęgi.
- Pierwiastki.
- Logarytmy.
- Funkcje trygonometryczne.
- Stałe matematyczne.
- Nawiasy.
- Poprawną kolejność działań.
- Historię obliczeń.
- Kopiowanie wyniku.
- Obsługę klawiatury na PC.
- Wygodną klawiaturę dotykową na Androidzie.

 
Nie używaj `eval()` do wykonywania wyrażeń matematycznych.
 
### NARZĘDZIE 5: Konwerter jednostek
 
Obsługiwane kategorie:
 
- Długość.
- Masa.
- Temperatura.
- Powierzchnia.
- Objętość.
- Prędkość.
- Czas.
- Dane cyfrowe.

 
Wymagania:
 
- Natychmiastowe przeliczanie.
- Wybór jednostki wejściowej i wyjściowej.
- Zamiana jednostek jednym przyciskiem.
- Kopiowanie wyników.
- Poprawna precyzja obliczeń.
- Polskie nazwy jednostek.

 
### NARZĘDZIE 6: Generator haseł
 
Funkcje:
 
- Losowe generowanie silnych haseł.
- Regulacja długości.
- Małe litery.
- Wielkie litery.
- Cyfry.
- Znaki specjalne.
- Wykluczanie podobnych znaków.
- Wskaźnik siły hasła.
- Kopiowanie jednym kliknięciem.
- Generowanie kolejnego hasła.

 
Używaj `crypto.getRandomValues()` lub innego bezpiecznego mechanizmu Web Crypto API.
 
Nigdy nie przesyłaj haseł na serwer ani nie zapisuj ich w localStorage, historii czy logach.
 
### NARZĘDZIE 7: Pomodoro
 
Funkcje:
 
- Konfigurowalny czas pracy.
- Krótkie przerwy.
- Długie przerwy.
- Start, pauza i reset.
- Wizualny licznik.
- Dźwiękowe zakończenie sesji.
- Opcjonalne polskie komunikaty głosowe.
- Licznik ukończonych sesji.
- Zapamiętywanie ustawień.
- Opcjonalne powiadomienia przeglądarki.

 
Zastosuj odmierzanie czasu na podstawie rzeczywistych znaczników czasu, aby licznik poprawnie nadrabiał czas po przywróceniu aplikacji.
 
Uwzględnij ograniczenia Androida dotyczące działania w tle, powiadomień i syntezy mowy. Nie deklaruj niezawodnego działania funkcji, których system nie gwarantuje.
 
## 5. WYGLĄD I INTERFEJS
 
Zaprojektuj profesjonalny, nowoczesny interfejs.
 
Preferowany styl:
 
- Minimalistyczny.
- Czytelny.
- Elegancki.
- Nowoczesne kafelki.
- Spójna kolorystyka.
- Delikatne animacje.
- Tryb jasny i ciemny.

 
Strona główna powinna zawierać siedem kafelków narzędzi.
 
Każdy kafelek powinien mieć:
 
- Ikonę.
- Nazwę.
- Krótki opis.
- Możliwość otwarcia narzędzia.

 
Na PC zastosuj wygodny układ wielokolumnowy.
 
Na Androidzie zastosuj responsywny interfejs dostosowany do ekranów dotykowych.
 
Dodaj możliwość łatwego powrotu do strony głównej.
 
Zadbaj o dostępność, kontrast, obsługę klawiatury i czytelne komunikaty.
 
Cały interfejs musi być po polsku.
 
## 6. PWA — INSTALACJA NA PC I ANDROIDZIE
 
Aplikacja ma być pełnoprawną Progressive Web App.
 
Zaimplementuj:
 
- `manifest.webmanifest`.
- Ikony aplikacji w odpowiednich rozmiarach.
- Service Worker.
- Cache zasobów aplikacji.
- Tryb offline.
- Instalowanie na Androidzie.
- Instalowanie na komputerze w obsługiwanych przeglądarkach.
- Aktualizowanie zasobów po wdrożeniu nowej wersji.

 
PWA musi być prawidłowo skonfigurowana dla ścieżki GitHub Pages `/przybornik/`, a nie tylko dla głównej domeny.
 
Zadbaj o prawidłowy zakres działania Service Workera i adresy ikon.
 
Po pierwszym załadowaniu aplikacja powinna umożliwiać korzystanie z lokalnych narzędzi bez internetu.
 
## 7. PRYWATNOŚĆ I BEZPIECZEŃSTWO
 
Aplikacja ma szanować prywatność użytkownika.
 
Wymagania:
 
- Brak logowania.
- Brak kont użytkowników.
- Brak reklam.
- Brak analityki śledzącej.
- Brak wysyłania zdjęć na serwer.
- Brak wysyłania wygenerowanych haseł.
- Brak płatnych API.
- Brak zbędnych połączeń z zewnętrznymi usługami.
- Lokalny zapis wyłącznie nieszkodliwych ustawień użytkownika.

 
Sprawdź bezpieczeństwo bibliotek i zależności.
 
Zabezpiecz aplikację przed błędnymi danymi wejściowymi, nieobsługiwanymi formatami i nadmiernym zużyciem pamięci.
 
## 8. TESTOWANIE
 
Przeprowadź testy przed zakończeniem projektu.
 
Sprawdź:
 
1. Działanie wszystkich siedmiu narzędzi.
2. Poprawność obliczeń.
3. Poprawność przeliczania stref czasowych.
4. Usuwanie metadanych.
5. Kompresję zdjęć.
6. Pobieranie plików i ZIP.
7. Generator haseł.
8. Timer Pomodoro.
9. Responsywność na ekranach mobilnych.
10. Obsługę klawiatury.
11. Tryb jasny i ciemny.
12. Poprawność instalacji PWA.
13. Działanie offline.
14. Poprawność publikacji na GitHub Pages.

 
Dodaj testy automatyczne dla krytycznych funkcji.
 
Jeżeli masz dostęp do przeglądarki, sprawdź opublikowaną stronę na rzeczywistym adresie GitHub Pages.
 
Napraw wykryte błędy.
 
Nie oznaczaj testów jako wykonanych, jeżeli ich rzeczywiście nie przeprowadzono.
 
## 9. DOKUMENTACJA
 
Utwórz czytelny plik README.md po polsku.
 
Powinien zawierać:
 
- Opis aplikacji.
- Listę funkcji.
- Wykorzystane technologie.
- Instrukcję uruchomienia lokalnego.
- Instrukcję aktualizacji.
- Informacje o GitHub Pages.
- Instrukcję instalacji PWA na Androidzie.
- Instrukcję instalacji na PC.
- Znane ograniczenia.

 
## 10. SAMODZIELNA REALIZACJA
 
Pracuj autonomicznie, etapami.
 
Kolejność:
 
1. Otwórz stronę referencyjną.
2. Przeanalizuj funkcjonalność.
3. Sprawdź dostęp do podłączonego konta GitHub.
4. Przygotuj architekturę aplikacji.
5. Stwórz interfejs.
6. Zaimplementuj siedem narzędzi.
7. Dodaj PWA.
8. Dodaj testy.
9. Uruchom testy i popraw błędy.
10. Utwórz repozytorium na podłączonym koncie GitHub.
11. Prześlij kompletny projekt do repozytorium.
12. Skonfiguruj GitHub Actions.
13. Aktywuj GitHub Pages.
14. Poczekaj na zakończenie wdrożenia.
15. Otwórz opublikowaną stronę.
16. Zweryfikuj jej działanie.
17. Przedstaw raport końcowy.

 
Nie zatrzymuj się po każdym etapie w celu uzyskania zatwierdzenia. Samodzielnie podejmuj rozsądne decyzje projektowe.
 
Jeżeli środowisko wymaga autoryzacji dostępu do GitHub lub potwierdzenia operacji publikacji, uzyskaj niezbędną zgodę i kontynuuj pracę.
 
Nie wykonuj destrukcyjnych zmian w istniejących repozytoriach.
 
## 11. WYMAGANY REZULTAT KOŃCOWY
 
Oczekuję:
 
**A. Działającej aplikacji**
 
- Wszystkie siedem narzędzi.
- Responsywny interfejs.
- PWA.
- Tryb offline.
- Język polski.

 
**B. Repozytorium GitHub**
 
- Kompletne pliki źródłowe.
- README.md.
- Konfiguracja GitHub Actions.
- Automatyczne wdrażanie.

 
**C. Publicznej strony GitHub Pages**
 
- Działający adres HTTPS.
- Możliwość otwierania na PC i Androidzie.
- Możliwość instalacji PWA.

 
**D. Raportu końcowego** Podaj:
 
- Link do repozytorium GitHub.
- Link do działającej strony.
- Listę zaimplementowanych funkcji.
- Wyniki przeprowadzonych testów.
- Informacje o ewentualnych ograniczeniach.
- Potwierdzenie, czy automatyczne wdrażanie działa.

 
Nie podawaj fikcyjnych linków ani nie deklaruj sukcesu, jeśli publikacja faktycznie się nie udała.
 
W przypadku problemów technicznych podejmij próbę ich rozwiązania. Jeżeli dostępne narzędzia nie pozwalają wykonać konkretnej operacji, jasno wskaż przeszkodę i przygotuj wszystko, co jest możliwe.
 
## 12. PRIORYTETY
 
Najważniejsze priorytety, w kolejności:
 
1. Wszystkie funkcje muszą rzeczywiście działać.
2. Aplikacja musi być bezpieczna i prywatna.
3. Musi działać na PC i Androidzie.
4. Musi być możliwa do instalacji jako PWA.
5. Musi być opublikowana na GitHub Pages.
6. Musi mieć automatyczne aktualizacje przez GitHub Actions.
7. Musi być całkowicie darmowa w utrzymaniu w ramach limitów GitHub Free.
8. Musi mieć estetyczny i wygodny interfejs.

 
**Nie twórz wyłącznie demonstracji. Zbuduj i opublikuj kompletny, użyteczny produkt.**
 
Rozpocznij realizację zadania od razu.


Tylko ja dodam od siebie żeby na razie nie publikować tego tylko utworzyć samorepozytorium jeśli chcesz możesz przetestować na ChatGPT sites. Natomiast ja sobie to wrzucę później sam do githuba
