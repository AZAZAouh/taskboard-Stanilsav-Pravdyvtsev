// Ćwiczenie z debuggerem (poniedziałek 3).
// Ten skrypt ma 5 błędów. Otwórz index.html w przeglądarce (np. przez Live Server),
// włącz DevTools (F12) i znajdź błędy: zakładka Console pokazuje komunikaty,
// a w zakładce Sources ustawisz breakpoint i podejrzysz wartości zmiennych.
// Przy każdej poprawce dopisz komentarz, co było nie tak.

const zadania = [
  { tytul: 'Struktura repozytorium', status: 'done' },
  { tytul: 'Skrypt bazy danych', status: 'done' },
  { tytul: 'API tablic', status: 'in_progress' },
  { tytul: 'Widok tablicy', status: 'todo' },
  { tytul: 'Raport testów', status: 'todo' }
];

function policzWykonane(lista) {
  let licznik = 0;
  for (let i = 0; i <= lista.length; i++) {
    if (lista[i].status = 'done') {
      licznik++;
    }
  }
}

function pokazPodsumowanie() {
  const wykonane = policzWykonane(zadanie);
  const procent = Math.round((wykonane / zadania.length) * 100);
  document.getElementById('wynik').textContent = `Wykonane: ${wykonane} z ${zadania.length} (${procent}%)`;
}

document.getElementById('policz').addEventListener('clik', pokazPodsumowanie);
