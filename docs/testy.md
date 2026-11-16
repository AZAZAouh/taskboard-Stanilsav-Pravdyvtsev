# Testy API TaskBoard

Adres API: `http://127.0.0.1:3000`

Testy wykonujemy w Postmanie. W kolumnie „Wynik” wpisujemy „Zgodny” lub „Niezgodny” po wykonaniu testu.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| T-01 | Rejestracja nowego użytkownika | `POST /api/auth/register` z wolnym loginem, hasłem, imieniem i nazwiskiem | `201`, dane nowego użytkownika | Zgodny |
| T-02 | Rejestracja zajętego loginu | Powtórzyć `POST /api/auth/register` z danymi z T-01 | `409`, komunikat o zajętym loginie | Zgodny |
| T-03 | Poprawne logowanie | `POST /api/auth/login` z poprawnym loginem i hasłem | `200`, dane użytkownika | Zgodny |
| T-04 | Logowanie złym hasłem | `POST /api/auth/login` z poprawnym loginem i błędnym hasłem | `401`, komunikat o błędnym loginie lub haśle | Zgodny |
| T-05 | Dane zalogowanego użytkownika | Po zalogowaniu wysłać `GET /api/auth/me` | `200`, ID, login, imię i nazwisko | Zgodny |
| T-06 | Dane użytkownika bez sesji | Po wylogowaniu wysłać `GET /api/auth/me` | `401`, prośba o zalogowanie | — |
| T-07 | Wylogowanie aktywnej sesji | Po zalogowaniu wysłać `POST /api/auth/logout` bez treści | `204`, sesja zakończona | — |
| T-08 | Wylogowanie bez aktywnej sesji | Po T-07 ponownie wysłać `POST /api/auth/logout` | `204`, użytkownik nadal wylogowany | — |
| T-09 | Lista zadań po zalogowaniu | `GET /api/boards/3/tasks` z aktywną sesją i ID istniejącej tablicy | `200`, lista zadań tablicy | — |
| T-10 | Lista zadań bez logowania | Po wylogowaniu wysłać `GET /api/boards/3/tasks` | `401`, prośba o zalogowanie | — |
| T-11 | Utworzenie tablicy | Po zalogowaniu wysłać `POST /api/boards` z nazwą i krótkim opisem | `201`, ID nowej tablicy | — |
| T-12 | Za długi opis tablicy | Po zalogowaniu wysłać `POST /api/boards` z poprawną nazwą i opisem dłuższym niż 255 znaków | `400`, komunikat o długości opisu | — |
| T-13 | Utworzenie zadania | Po zalogowaniu wysłać `POST /api/tasks` z tytułem i ID istniejącej tablicy | `201`, ID nowego zadania | — |
| T-14 | Zadanie bez tytułu | Po zalogowaniu wysłać `POST /api/tasks` z pustym `title` i poprawnym `boardId` | `400`, komunikat o tytule | — |
| T-15 | Szczegóły istniejącego zadania | Po zalogowaniu wysłać `GET /api/tasks/:id` z ID z T-13 | `200`, dane zadania | — |
| T-16 | Szczegóły nieistniejącego zadania | Po zalogowaniu wysłać `GET /api/tasks/:id` z ID zadania, którego nie ma w bazie | `404`, komunikat o braku zadania | — |
| T-17 | Zmiana istniejącego zadania | Po zalogowaniu wysłać `PUT /api/tasks/:id` z ID z T-13 i poprawnymi danymi | `200`, zaktualizowane dane | — |
| T-18 | Zmiana nieistniejącego zadania | Po zalogowaniu wysłać `PUT /api/tasks/:id` z poprawnymi danymi i ID zadania, którego nie ma w bazie | `404`, komunikat o braku zadania | — |
| T-19 | Usunięcie zadania testowego | Po zalogowaniu wysłać `DELETE /api/tasks/:id` z ID z T-13 | `204`, zadanie usunięte miękko | — |
| T-20 | Ponowne usunięcie zadania | Po T-19 ponowić `DELETE /api/tasks/:id` z tym samym ID | `404`, komunikat o braku zadania | — |