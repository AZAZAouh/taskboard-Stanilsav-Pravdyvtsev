## Część 2 (środa): API zadań

**Termin:** piątek 18:00, zmiany scalone do `main`.

### Plan dni

- Czwartek: API zadań i `GET /api/users`.
- Piątek: walidacja, kolekcja Postman, opis bazy w README; termin 18:00.

### Do zrobienia

- Nowy branch `feature/tb-2-api`.
- `backend/routes/tasks.js` na wzór `routes/boards.js`:
  - `GET /api/boards/:boardId/tasks` (200, 404),
  - `GET /api/tasks/:id` (200, 404),
  - `POST /api/tasks` (201, 400),
  - `PUT /api/tasks/:id` (200, 400, 404),
  - `DELETE /api/tasks/:id` – soft delete (204, 404).
- `backend/routes/users.js` z `GET /api/users` bez pola `passwordHash`.
- Walidacja: tytuł 3–100 znaków, `status` i `priority` z listy, `deadline` jako `RRRR-MM-DD` albo puste, tablica i osoba muszą istnieć.
- Kolekcja Postman w `docs/postman/` z przypadkami 400 i 404.
- Sekcja „Baza danych” w README: tabele, relacje, soft delete, jak odtworzyć bazę.
- Dopisz tę część do `docs/zadania/TB-2.md`.

### Gotowe, gdy

- [ ] Wszystkie trasy działają w Postmanie i zwracają właściwe kody.
- [ ] Usunięte zadanie znika z listy, ale zostaje w bazie z `isDeleted = 1`.
- [ ] `GET /api/users` nie zwraca `passwordHash`.
- [ ] Pull request z branchu `feature/tb-2-api` jest scalony do piątku 18:00.
