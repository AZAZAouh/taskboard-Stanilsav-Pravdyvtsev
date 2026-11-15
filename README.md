# TaskBoard

Aplikacja do zarządzania tablicami i zadaniami, tworzona w ramach praktyk

## Technologie

- Node.js i Express
- MariaDB w XAMPP
- Git

## Uruchomienie

1. Włącz Apache i MySQL w XAMPP
2. Odtwórz bazę i utwórz konta zgodnie z instrukcją w sekcji „Baza danych”
3. Skopiuj plik `.env.example` do `.env` i uzupełnij dane połączenia z bazą

4. W PowerShell przejdź do katalogu `backend` i uruchom serwer

   ```powershell
   cd backend
   npm.cmd ci
   npm.cmd start
   ```

5. Otwórz `http://127.0.0.1:3000/api/health` i sprawdź, czy serwer zwraca `{"ok":true}`

## Struktura projektu

| Katalog | Zawartość |
| --- | --- |
| `frontend/` | Interfejs użytkownika |
| `backend/` | Serwer i trasy API |
| `database/` | Pliki SQL i kopia zapasowa |
| `docs/zadania/` | Treści zadań z praktyk |
| `materialy/` | Materiały od prowadzącego |

## API

| Metoda | Adres | Działanie |
| --- | --- | --- |
| GET | `/api/boards` | Lista aktywnych tablic |
| POST | `/api/boards` | Dodanie tablicy |
| DELETE | `/api/boards/:id` | Miękkie usunięcie tablicy |
| GET | `/api/boards/:boardId/tasks` | Lista aktywnych zadań tablicy |
| GET | `/api/tasks/:id` | Szczegóły zadania |
| POST | `/api/tasks` | Dodanie zadania |
| PUT | `/api/tasks/:id` | Edycja zadania |
| DELETE | `/api/tasks/:id` | Miękkie usunięcie zadania |
| GET | `/api/users` | Lista użytkowników bez `passwordHash` |

Tytuł zadania musi mieć od 3 do 100 znaków po obcięciu spacji. Statusy to `todo`, `in_progress` i `done`, a priorytety to `low`, `medium` i `high`. Domyślny status to `todo`

Termin można zostawić pusty lub podać w formacie `RRRR-MM-DD`. Zadanie musi należeć do aktywnej tablicy. Jeśli podano wykonawcę, musi on istnieć w bazie

## Baza danych

| Tabela | Dane i relacje |
| --- | --- |
| `users` | Dane użytkowników i hashe haseł |
| `boards` | Tablice. Pole `ownerId` wskazuje właściciela w `users` |
| `tasks` | Zadania. Pole `boardId` wskazuje tablicę w `boards`, a opcjonalne `assigneeId` wskazuje wykonawcę w `users` |

Tablice i zadania są usuwane miękko. Rekord zostaje w bazie z `isDeleted = 1` i datą w `deletedAt`. Listy zwracane przez API pomijają takie rekordy

### Odtworzenie bazy

1. Utwórz bazę `taskboard` w phpMyAdmin
2. Zaimportuj `database/backup/taskboard.sql`
3. W lokalnej kopii `database/konta.sql` zastąp przykładowe hasła własnymi i uruchom skrypt jako administrator bazy
4. Wpisz dane konta `taskboard_app` w pliku `.env`

### Sprawdzenie kopii zapasowej

Kopię odtworzyłem w bazie `taskboard_test`. Liczba rekordów sprawdzona przez `SELECT COUNT(*)` zgadzała się we wszystkich tabelach

| Tabela | `taskboard` | `taskboard_test` |
| --- | ---: | ---: |
| `users` | 5 | 5 |
| `boards` | 3 | 3 |
| `tasks` | 2 | 2 |

## Autor

Stanislav Pravdyvtsev
