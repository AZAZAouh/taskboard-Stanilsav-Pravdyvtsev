# API TaskBoard

Adres lokalny: `http://127.0.0.1:3000/api`. Dane wysyłamy jako JSON z nagłówkiem `Content-Type: application/json`.

Po zalogowaniu serwer zapisuje sesję w ciasteczku. Wszystkie trasy tablic, zadań i użytkowników wymagają logowania; bez sesji zwracają `401`. Błąd serwera ma kod `500` i odpowiedź `{"error":"Błąd serwera"}`.

## Trasy

| Metoda | Adres (po `/api`) | Działanie | Kody odpowiedzi |
| --- | --- | --- | --- |
| GET | `/health` | Sprawdzenie działania serwera | 200 |
| POST | `/auth/register` | Rejestracja i utworzenie sesji | 201, 400, 409 |
| POST | `/auth/login` | Logowanie | 200, 400, 401 |
| POST | `/auth/logout` | Zakończenie sesji | 204 |
| GET | `/auth/me` | Dane zalogowanej osoby | 200, 401, 404 |
| GET | `/users` | Lista osób bez haseł | 200, 401 |
| GET | `/boards` | Lista aktywnych tablic | 200, 401 |
| POST | `/boards` | Utworzenie tablicy; właściciel z sesji | 201, 400, 401 |
| PUT | `/boards/:id` | Zmiana nazwy i opisu | 200, 400, 401, 404 |
| DELETE | `/boards/:id` | Miękkie usunięcie tablicy | 204, 400, 401, 404 |
| GET | `/boards/:boardId/tasks` | Zadania tablicy z filtrami | 200, 400, 401, 404 |
| GET | `/boards/:boardId/trash` | Zadania w koszu aktywnej tablicy | 200, 400, 401, 404 |
| GET | `/tasks/:id` | Szczegóły aktywnego zadania | 200, 401, 404 |
| POST | `/tasks` | Nowe zadanie | 201, 400, 401 |
| PUT | `/tasks/:id` | Edycja zadania, także statusu | 200, 400, 401, 404 |
| DELETE | `/tasks/:id` | Przeniesienie zadania do kosza | 204, 401, 404 |
| POST | `/tasks/:id/restore` | Przywrócenie zadania z kosza | 204, 400, 401, 404 |
| POST | `/tasks/:id/deletion-request` | Zgłoszenie zadania z kosza administratorowi | 204, 400, 401, 409 |
| GET | `/admin/deletion-requests` | Lista oczekujących zgłoszeń (administrator) | 200, 401, 403 |
| POST | `/admin/deletion-requests/:id/reject` | Odrzucenie zgłoszenia (administrator) | 204, 400, 401, 403, 404 |
| DELETE | `/tasks/:id/permanent` | Zatwierdzenie zgłoszenia i usunięcie (administrator) | 204, 400, 401, 403, 404, 503 |

Kod `204` oznacza sukces bez treści odpowiedzi. Ostateczne usunięcie wymaga roli `admin` na stronie, oczekującego zgłoszenia i osobnego połączenia z kontem MySQL administratora (`ADMIN_DB_USER`, `ADMIN_DB_PASSWORD`). Brak konfiguracji daje `503`. Zwykły użytkownik otrzymuje `403`; konto aplikacji nie dostaje prawa DELETE.

## Dane i walidacja

Rejestracja przyjmuje `login`, `password`, `firstName`, `lastName`. Login ma 3–30 liter łacińskich, cyfr lub znaków `.`, `_`, `-`. Imię i nazwisko mają 1–50 znaków. Hasło ma co najmniej 8 znaków i najwyżej 72 bajty UTF-8 (ograniczenie bcrypt). Zajęty login daje `409`. Hasła nie są zwracane w odpowiedziach.

Tablica przyjmuje `name` (1–80 znaków) i opcjonalny `description` (do 255 znaków). `ownerId` i `deletedById` pochodzą z sesji.

Zadanie przyjmuje `title` (3–100 znaków), opcjonalny `description`, `status` (`todo`, `in_progress`, `done`), `priority` (`low`, `medium`, `high`), opcjonalny `deadline` (`RRRR-MM-DD`) i `assigneeId` (ID istniejącej osoby lub `null`). Przy tworzeniu wymagany jest również `boardId`. Przy edycji przesyłamy cały formularz. Domyślny status nowego zadania to `todo`.

Miękkie usunięcie ustawia `isDeleted = 1`, `deletedAt` i `deletedById`. Przywrócenie zeruje flagę i czyści oba pola. Status zadania zostaje zachowany.

## Filtry

Przykład: `GET /api/boards/1/tasks?priority=high&assigneeId=1&q=API`.

Filtry są łączone: zadanie musi spełnić wszystkie podane warunki. `assigneeId` musi być dodatnią liczbą całkowitą; błędna wartość daje `400`. Parametr `q` szuka fragmentu tytułu przez `LIKE`. Brak parametru wyłącza dany filtr.

## Przykładowe zadanie

Odpowiedź z `GET /api/tasks/15` (przykładowe dane):

```json
{
  "id": 15,
  "title": "Przygotować prezentację",
  "description": "Pokazać logowanie i obsługę zadań",
  "status": "in_progress",
  "priority": "high",
  "deadline": "2026-11-20",
  "boardId": 1,
  "assigneeId": 1,
  "createdAt": "2026-11-19 12:00:00"
}
```

Błąd walidacji może zawierać również `fields`, aby formularz pokazał błąd przy odpowiednim polu:

```json
{
  "error": "Popraw zaznaczone pola",
  "fields": {
    "name": "Nazwa musi mieć od 1 do 80 znaków"
  }
}
```

## Rozpatrywanie usunięcia

Zgłoszenie ustawia w zadaniu `purgeRequestedAt` i `purgeRequestedById`. Duplikat lub zgłoszenie aktywnego zadania daje 409. Odrzucenie i przywrócenie czyszczą oba pola. Administrator może fizycznie usunąć tylko zadanie, które nadal jest w koszu, ma oczekujące zgłoszenie i należy do aktywnej tablicy. Rola jest sprawdzana w bazie przy każdym żądaniu administracyjnym.

`GET /auth/me` zwraca również `role` (`viewer`, `editor` albo `admin`). Żadna trasa nie zwraca hasha hasła ani danych połączenia z MySQL.

## Uprawnienia do edycji

Nowa rejestracja zawsze otrzymuje `viewer`, także przy próbie wysłania innej roli w JSON. Obserwator może odczytywać tablice, zadania, kosz i listę osób oraz korzystać z filtrów. Wszystkie trasy zmieniające tablice i zadania wymagają roli `editor` lub `admin`; obserwator otrzymuje 403. Dotyczy to również przywracania i zgłaszania usunięcia. Zatwierdzanie i odrzucanie zgłoszeń pozostaje dostępne tylko dla `admin`. Serwer sprawdza rolę w bazie przy żądaniu, niezależnie od widoczności przycisków.
