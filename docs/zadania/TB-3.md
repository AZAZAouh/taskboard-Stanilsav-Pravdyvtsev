# TB-3: Frontend, integracja i oddanie projektu

## Część 1 (poniedziałek 3)

**Termin:** piątek 18:00, zmiany scalone do `main` (deadline oddania projektu).

### Plan dni

- Wtorek: `login.html` i `boards.html`.
- Środa: `board.html`; część 2 na Teams.

### Do zrobienia

- Widoki `login.html`, `boards.html` i `board.html` według makiety (`materialy/makieta/`), na Bootstrapie 5.3 z własnym `css/style.css`.
- Rejestracja na stronie logowania; w nagłówku imię zalogowanej osoby i przycisk „Wyloguj”.
- Tablice w interfejsie: lista, dodawanie, edycja i usuwanie (z potwierdzeniem).
- Modal zadania: dodawanie, edycja i szczegóły.
- Zmiana statusu zadania przyciskiem i usuwanie z potwierdzeniem.
- Treść tego zadania w `docs/zadania/TB-3.md`.

### Gotowe, gdy

- [ ] Po zalogowaniu działają wszystkie trzy widoki.
- [ ] Bez logowania strona przenosi na logowanie.
- [ ] Pull request z branchu `feature/tb-3-frontend` ma zielony workflow i jest scalony przez merge commit.

## Część 2 (środa): Rozbudowa, testy i oddanie projektu

**Termin:** piątek 18:00, zmiany scalone do `main` i tag `v1.0`.

### Plan dni

- Czwartek: filtry, walidacja, telefon, Lighthouse, W3C.
- Piątek: testy, `api.md`, README, czysty klon, tag `v1.0`; oddanie do 18:00.

### Do zrobienia

- Nowy branch `feature/tb-3-oddanie`.
- Filtry w API: `assigneeId` (liczba, inaczej 400) i `q` (fragment tytułu, `LIKE`), łączone z `priority`.
- Pasek filtrów we frontendzie: lista osób, pole wyszukiwania, „Wyczyść filtry”; zapytanie przy każdej zmianie.
- Walidacja wszystkich formularzy (`is-invalid`, `invalid-feedback`) i komunikaty błędów z API.
- Telefon i dostępność: kolumny jedna pod drugą, Lighthouse co najmniej 90, W3C bez błędów.
- `docs/testy.md`: co najmniej 10 przypadków testowych z wynikami.
- `docs/api.md`: tabela wszystkich tras i przykład JSON.
- Końcowe README z instrukcją uruchomienia sprawdzoną na czystym klonie.
- Dopisz tę część do `docs/zadania/TB-3.md`.
- Tag `v1.0` na `main`: `git tag v1.0`, potem `git push origin v1.0`.

### Gotowe, gdy

- [ ] Filtry działają razem, błędna wartość daje 400.
- [ ] Dokumentacja i raport testów są w `docs/`.
- [ ] Projekt uruchamia się na czystym komputerze według README.
- [ ] Wszystko jest na `main` z tagiem `v1.0` do piątku 18:00.
