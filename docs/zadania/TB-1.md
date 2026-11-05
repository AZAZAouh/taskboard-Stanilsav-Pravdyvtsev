# TB-1: Struktura repozytorium i opis danych

## Część 1 (poniedziałek 1)

**Termin:** piątek 18:00, zmiany scalone do `main`.

### Do zrobienia

- Foldery `frontend/`, `backend/`, `database/`, `docs/` i `docs/zadania/`; w każdym plik `README.md` z 2–4 zdaniami, za co folder odpowiada.
- Główne `README.md`: opis aplikacji, technologie, tabela folderów, szkic sekcji „Uruchomienie”, autor.
- Plik `.gitignore` z wpisami `node_modules/` i `.env`.
- Ochrona gałęzi `main`: pull request wymagany, blokada force pusha i usunięcia; w ustawieniach tylko scalanie przez merge commit.
- Treść tego zadania w `docs/zadania/TB-1.md`.

### Gotowe, gdy

- [ ] Na branchu `feature/tb-1-start` są co najmniej 3 commity z opisem.
- [ ] Pull request ma zielony workflow.
- [ ] Pull request jest scalony przez merge commit, a branch nie został usunięty.

## Część 2 (środa): Opis danych i wstępny diagram ERD

**Termin:** piątek 18:00, zmiany scalone do `main`.

### Plan dni

- Środa: opis danych i wstępny diagram ERD (to zadanie).
- Czwartek: ćwiczenia SQL w kursie SQLBolt, lekcje 1–12 (osobny PDF).
- Piątek: przygotowanie do poniedziałku 2 (osobny PDF) i dokończenie TB-1 do 18:00.

### Do zrobienia

1. `git switch main`, `git pull`, potem nowy branch `feature/tb-1-dane`.
2. Skopiuj `materialy/dane-szablon.md` jako `docs/dane.md`.
3. Opis danych: użytkownik, tablica i zadanie, każde z co najmniej 4 informacjami i przykładową wartością; powiązania w co najmniej 3 zdaniach; przykład zadania w JSON.
4. Na końcu `docs/dane.md` sekcja „Wstępny diagram ERD”: tabele, kolumny z typami, klucze główne (`PK`) i obce (`FK`), powiązania. Diagram w Mermaid albo jako obrazek `docs/erd-szkic.png`.
5. Usuń z pliku komentarze z pytaniami pomocniczymi.
6. Dopisz tę część do `docs/zadania/TB-1.md`.
7. Pull request, zielony workflow, scalenie przez merge commit.

### Gotowe, gdy

- [ ] `docs/dane.md` opisuje użytkownika, tablicę i zadanie z przykładami.
- [ ] Powiązania są opisane w co najmniej 3 zdaniach i jest przykład zadania w JSON.
- [ ] Jest wstępny diagram ERD z co najmniej trzema tabelami, kluczami głównymi i obcymi.
- [ ] Pull request z branchu `feature/tb-1-dane` jest scalony do piątku 18:00.
