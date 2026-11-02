#!/usr/bin/env bash
# Sprawdzenie struktury projektu TaskBoard (uruchamiane przez GitHub Actions).
# Każdy problem jest wypisany po polsku z podpowiedzią, co poprawić.
blad=0

# 1. Wymagane pliki
for plik in README.md .gitignore frontend/README.md backend/README.md database/README.md docs/README.md; do
  if [ ! -f "$plik" ]; then
    echo "BRAK PLIKU: $plik"
    blad=1
  fi
done

# 2. Opisy folderów nie mogą być puste (min. 2 niepuste linie)
for plik in frontend/README.md backend/README.md database/README.md docs/README.md; do
  if [ -f "$plik" ] && [ "$(grep -cv '^[[:space:]]*$' "$plik")" -lt 2 ]; then
    echo "ZA KRÓTKI OPIS: $plik – napisz w 2–4 zdaniach, za co odpowiada folder"
    blad=1
  fi
done

# 3. .gitignore musi chronić node_modules i .env
if [ -f .gitignore ]; then
  grep -q "node_modules" .gitignore || { echo "W .gitignore brakuje wpisu node_modules/"; blad=1; }
  grep -qE '^/?\.env[[:space:]]*$' .gitignore || { echo "W .gitignore brakuje wpisu .env"; blad=1; }
fi

# 4. W repozytorium nie może być sekretów ani zależności
if git ls-files | grep -qE '(^|/)\.env$'; then
  echo "PLIK .env JEST W REPOZYTORIUM – usuń go poleceniem: git rm --cached .env"
  blad=1
fi
if git ls-files | grep -q 'node_modules/'; then
  echo "FOLDER node_modules JEST W REPOZYTORIUM – usuń go poleceniem: git rm -r --cached node_modules"
  blad=1
fi

# 5. Składnia plików JavaScript (bez materiałów do ćwiczeń)
for plik in $(git ls-files '*.js' | grep -v '^materialy/'); do
  node --check "$plik" || { echo "BŁĄD SKŁADNI: $plik"; blad=1; }
done

if [ "$blad" -eq 0 ]; then
  echo "Struktura projektu jest w porządku."
fi
exit $blad
