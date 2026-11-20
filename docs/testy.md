# Testy API TaskBoard

Adres API: `http://127.0.0.1:3000`

Kolekcja [Postman](postman/TaskBoard-TB-2.postman_collection.json) zawiera 25 zapytań. Uruchomiono ją 20.11.2026 przez Newman 6.2.1 na osobnej bazie i serwerze testowym. Wszystkie przypadki T-01–T-20 sprawdzono ponownie; liczba w kolumnie „Wynik” to otrzymany kod HTTP. Zapis wymaga konta z rolą `editor` lub `admin`.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| T-01 | Rejestracja nowego użytkownika | `POST /api/auth/register` z wolnym loginem, hasłem, imieniem i nazwiskiem | `201`, dane nowego użytkownika | Zgodny |
| T-02 | Rejestracja zajętego loginu | Powtórzyć `POST /api/auth/register` z danymi z T-01 | `409`, komunikat o zajętym loginie | Zgodny |
| T-03 | Poprawne logowanie | `POST /api/auth/login` z poprawnym loginem i hasłem | `200`, dane użytkownika | Zgodny |
| T-04 | Logowanie złym hasłem | `POST /api/auth/login` z poprawnym loginem i błędnym hasłem | `401`, komunikat o błędnym loginie lub haśle | Zgodny |
| T-05 | Dane zalogowanego użytkownika | Po zalogowaniu wysłać `GET /api/auth/me` | `200`, ID, login, imię i nazwisko | Zgodny |
| T-06 | Dane użytkownika bez sesji | Po wylogowaniu wysłać `GET /api/auth/me` | `401`, prośba o zalogowanie | Zgodny (401) |
| T-07 | Wylogowanie aktywnej sesji | Po zalogowaniu wysłać `POST /api/auth/logout` bez treści | `204`, sesja zakończona | Zgodny (204) |
| T-08 | Wylogowanie bez aktywnej sesji | Po T-07 ponownie wysłać `POST /api/auth/logout` | `204`, użytkownik nadal wylogowany | Zgodny (204) |
| T-09 | Lista zadań po zalogowaniu | `GET /api/boards/:boardId/tasks` z aktywną sesją i ID tablicy utworzonej przez kolekcję | `200`, lista zadań tablicy | Zgodny (200) |
| T-10 | Lista zadań bez logowania | Po wylogowaniu wysłać `GET /api/boards/:boardId/tasks` | `401`, prośba o zalogowanie | Zgodny (401) |
| T-11 | Utworzenie tablicy | Po zalogowaniu wysłać `POST /api/boards` z nazwą i krótkim opisem | `201`, ID nowej tablicy | Zgodny (201) |
| T-12 | Za długi opis tablicy | Po zalogowaniu wysłać `POST /api/boards` z poprawną nazwą i opisem dłuższym niż 255 znaków | `400`, komunikat o długości opisu | Zgodny (400) |
| T-13 | Utworzenie zadania | Po zalogowaniu wysłać `POST /api/tasks` z tytułem i ID istniejącej tablicy | `201`, ID nowego zadania | Zgodny (201) |
| T-14 | Zadanie bez tytułu | Po zalogowaniu wysłać `POST /api/tasks` z pustym `title` i poprawnym `boardId` | `400`, komunikat o tytule | Zgodny (400) |
| T-15 | Szczegóły istniejącego zadania | Po zalogowaniu wysłać `GET /api/tasks/:id` z ID z T-13 | `200`, dane zadania | Zgodny (200) |
| T-16 | Szczegóły nieistniejącego zadania | Po zalogowaniu wysłać `GET /api/tasks/:id` z ID zadania, którego nie ma w bazie | `404`, komunikat o braku zadania | Zgodny (404) |
| T-17 | Zmiana istniejącego zadania | Po zalogowaniu wysłać `PUT /api/tasks/:id` z ID z T-13 i poprawnymi danymi | `200`, zaktualizowane dane | Zgodny (200) |
| T-18 | Zmiana nieistniejącego zadania | Po zalogowaniu wysłać `PUT /api/tasks/:id` z poprawnymi danymi i ID zadania, którego nie ma w bazie | `404`, komunikat o braku zadania | Zgodny (404) |
| T-19 | Usunięcie zadania testowego | Po zalogowaniu wysłać `DELETE /api/tasks/:id` z ID z T-13 | `204`, zadanie usunięte miękko | Zgodny (204) |
| T-20 | Ponowne usunięcie zadania | Po T-19 ponowić `DELETE /api/tasks/:id` z tym samym ID | `404`, komunikat o braku zadania | Zgodny (404) |

## Weryfikacja poprawek — 20.11.2026

Przywrócono `database/backup/taskboard-2026-11-20.sql` do osobnej, tymczasowej bazy. Przed testami zapytania COUNT(*) potwierdziły liczby rekordów: users = 5, boards = 3, tasks = 10, zgodne z danymi kopii.

Newman wykonał 25 zapytań i 44 sprawdzenia odpowiedzi: wszystkie poprawne, bez błędów. Oprócz T-01–T-20 sprawdzono ponowne logowanie, pustą nazwę tablicy (400), listę tablic (200), edycję nieistniejącej tablicy (404) i usunięcie utworzonej tablicy (204).

Kolekcja zapisuje ID nowej tablicy i zadania w zmiennych `boardId` i `taskId`. Dlatego do uruchomienia nie jest potrzebna istniejąca tablica o konkretnym numerze. Przypadki są wykonywane w kolejności zapisanej w kolekcji, tak aby logowanie i utworzenie danych poprzedzały zależne operacje.

Po sprawdzeniu usunięto tymczasową bazę, konto MySQL i zakończono serwer testowy. Baza robocza `taskboard` nie była modyfikowana podczas tego uruchomienia.

## Sprawdzenie TB-3 — 19.11.2026

Poniższe scenariusze wykonano automatycznie w Chrome na lokalnym serwerze i bazie. Utworzono osobną tablicę testową, a po sprawdzeniu przeniesiono ją do usuniętych. Wyniki wcześniejszej tabeli pochodzą z poprzedniego etapu pracy.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| UI-01 | Logowanie w przeglądarce | Wpisać dane `anna.nowak`, wysłać formularz | Przejście do listy tablic | Zgodny |
| UI-02 | Utworzenie tablicy przez API | POST z nazwą i opisem po zalogowaniu | 201 i ID tablicy | Zgodny |
| UI-03 | Utworzenie zadania z osobą | POST z tytułem, priorytetem high i assigneeId=1 | 201 i ID zadania | Zgodny |
| UI-04 | Trzy filtry razem | GET z priority=high, assigneeId=1 i q=filtr | Jedno pasujące zadanie testowe | Zgodny |
| UI-05 | Wykluczenie przez filtr | Zmienić priority na low przy tych samych filtrach | Pusta lista | Zgodny |
| UI-06 | Błędna osoba w filtrze | GET z assigneeId=abc | 400 | Zgodny |
| UI-07 | Krótki tytuł w formularzu | Otworzyć nowe zadanie i wpisać ab | Czerwone pole z błędem, formularz nie zapisuje | Zgodny |
| UI-08 | Widok komputera | Ustawić szerokość 1280 px | Brak poziomego przewijania | Zgodny |
| UI-09 | Widok telefonu | Ustawić szerokość 390 px | Brak poziomego przewijania | Zgodny |
| UI-10 | Przenoszenie myszą | Przeciągnąć zadanie do Gotowe i odczytać API | Status done w API | Zgodny |
| UI-11 | Kosz | Usunąć testowe zadanie i pobrać kosz | Zadanie jest w koszu | Zgodny |
| UI-12 | Przywrócenie | POST restore dla zadania z kosza | 204 | Zgodny |
| UI-13 | Ostateczne usunięcie | Usunąć zadanie, następnie DELETE permanent | 204 i brak rekordu | Niezgodny: 500, konto bazy nie ma prawa DELETE |
| UI-14 | Wylogowanie | Kliknąć Wyloguj | Przejście na login.html | Zgodny |
| UI-15 | Widok bez sesji | Po wylogowaniu otworzyć boards.html | Przekierowanie na logowanie | Zgodny |
| UI-16 | Błędy JavaScript | Rejestrować wyjątki podczas powyższych operacji | Brak nieobsłużonych wyjątków | Zgodny |

Dodatkowo wykonano 13 testów obsługi walidacji tras (bez połączenia z bazą): błędny login, krótkie i zbyt długie hasło, puste imię, niewłaściwe typy, pusta nazwa tablicy, za długi opis, krótki tytuł, błędny priorytet, status, data i wykonawca. Wszystkie zwróciły 400 z informacją o polu; żadne nie dotarło do bazy.

## Dostępność i HTML

Lighthouse 12.8.2, Accessibility, 19.11.2026:

| Widok | Wynik |
| --- | ---: |
| Logowanie | 100 |
| Lista tablic | 100 |
| Tablica | 96 |
| Panel administratora | 100 |

Skrót wyników: [Sprawdzenie dostępności i HTML](audits/README.md).

Na tablicy Lighthouse zgłosił kontrast części elementów. Wszystkie widoki przekraczają wymagane 90 punktów. Raporty dotyczą zamkniętych okien formularzy.

Cztery pliki HTML sprawdzono lokalnym Nu Html Checker 23.4.11 (walidator używany również przez W3C). Nie wysyłano kodu do zewnętrznego serwisu. Wynik: zero błędów. Wynik zapisano w [raporcie HTML](audits/html-validation.json).

Próbę czystego klonu wykonano 19.11.2026 z gałęzi `feature/tb-3-oddanie` pobranej z GitHub. W nowym katalogu zaimportowano kopię SQL do odizolowanej bazy, przygotowano `.env` ze wzoru, wykonano `npm ci` i uruchomiono serwer. Sprawdzono logowanie udokumentowanym kontem testowym, odczyt tablic, rejestrację, nadanie roli administratora, utworzenie zadania, zgłoszenie i zatwierdzenie fizycznego usunięcia. Wszystko zgodne. Tymczasową bazę, konta MySQL i testowy plik `.env` usunięto po próbie.

## Zgłoszenia do administratora — 19.11.2026

Ostateczne usuwanie z UI-13 zastąpiono zgłoszeniem do administratora. Nie zmieniano praw konta MySQL aplikacji. Poniższe sprawdzenie wykonano w lokalnym Chrome na osobnej tablicy testowej. Po próbie zadanie przywrócono (anulując zgłoszenie), a tablicę testową usunięto miękko.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| ADM-01 | Logowanie użytkownika | Zalogować zwykłe konto | 200 | Zgodny |
| ADM-02 | Logowanie administratora | Zalogować osobne konto administratora | 200, role=admin w auth/me | Zgodny |
| ADM-03 | Ochrona kolejki | GET admin/deletion-requests jako użytkownik | 403 | Zgodny |
| ADM-04 | Zgłoszenie aktywnego zadania | POST deletion-request przed usunięciem | 409 | Zgodny |
| ADM-05 | Zgłoszenie z kosza | Usunąć zadanie i wysłać deletion-request | 204 | Zgodny |
| ADM-06 | Duplikat | Powtórzyć zgłoszenie | 409 | Zgodny |
| ADM-07 | Zakaz zatwierdzania | DELETE permanent jako zwykły użytkownik | 403 | Zgodny |
| ADM-08 | Zakaz odrzucania | POST reject jako zwykły użytkownik | 403 | Zgodny |
| ADM-09 | Zawartość kolejki | GET kolejki jako administrator | Zawiera zadanie testowe | Zgodny |
| ADM-10 | Panel administratora | Otworzyć admin.html | Widoczny tytuł zgłoszenia | Zgodny |
| ADM-11 | Odrzucenie | POST reject jako administrator | 204 | Zgodny |
| ADM-12 | Przywrócenie | Ponowić zgłoszenie i przywrócić zadanie | 204 | Zgodny |
| ADM-13 | Anulowanie zgłoszenia | Odczytać kolejkę po przywróceniu | Nie zawiera zadania | Zgodny |
| ADM-14 | Brak konfiguracji MySQL admina | Zgłosić zadanie i zatwierdzić bez ADMIN_DB_PASSWORD | 503, zgłoszenie pozostaje | Zgodny |
| ADM-15 | Pełne zatwierdzenie | Skonfigurować konto MySQL administratora i zatwierdzić | 204 i fizyczne usunięcie | Zgodny: 204, potem GET zadania zwraca 404 |

Lighthouse powtórzono po zmianach: logowanie 100, tablice 100, tablica 96, panel administratora 100.

## Obserwator i układ kosza — 19.11.2026

Sprawdzono nową rejestrację oraz zachowanie w Chrome. Tymczasowe konto obserwatora usunięto po teście. Dane testowej tablicy przywrócono i tablicę usunięto miękko.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| ROLE-01 | Rola po rejestracji | Zarejestrować konto, wysyłając dodatkowo role=admin | auth/me zwraca viewer | Zgodny |
| ROLE-02 | Zapis tablic | POST, PUT i DELETE tablicy jako viewer | Każde żądanie zwraca 403 | Zgodny |
| ROLE-03 | Zapis zadań | POST, PUT i DELETE zadania jako viewer | Każde żądanie zwraca 403 | Zgodny |
| ROLE-04 | Kosz i decyzje | Jako viewer wysłać restore, deletion-request i permanent | Każde żądanie zwraca 403 | Zgodny |
| ROLE-05 | Interfejs zadania | Otworzyć tablicę i szczegóły jako viewer | Brak przeciągania i przycisków zapisu; pola szczegółów wyłączone | Zgodny |
| ROLE-06 | Lista tablic | Otworzyć listę jako viewer | Brak dodawania i edycji | Zgodny |
| ROLE-07 | Oczekujące zgłoszenie | Otworzyć kosz z oczekującą prośbą na 390 px | Status jest tekstową etykietą; brak poziomego przewijania | Zgodny |

Wcześniejsze scenariusze zmian oznaczone jako wykonywane przez zwykłe konto dotyczą obecnej roli `editor`. Nowe konto `viewer` nie ma tych uprawnień.
