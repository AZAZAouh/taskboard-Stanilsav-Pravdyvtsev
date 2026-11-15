
// Poprawiono 5 błędów Przy każdej poprawce znajduje się wyjaśnienie

const zadania = [
  { tytul: 'Struktura repozytorium', status: 'done' },
  { tytul: 'Skrypt bazy danych', status: 'done' },
  { tytul: 'API tablic', status: 'in_progress' },
  { tytul: 'Widok tablicy', status: 'todo' },
  { tytul: 'Raport testów', status: 'todo' }
];

function policzWykonane(lista) {
  let licznik = 0;

  // 1. Zmieniłem <= na <
  for (let i = 0; i < lista.length; i++) {
    // 2. Zmieniłem = na ===.
    if (lista[i].status === 'done') {
      licznik++;
    }
  }

  // 3. Dodałem return licznik
  return licznik;
}

function pokazPodsumowanie() {
  // 4. Zmieniłem zadanie na zadania
  const wykonane = policzWykonane(zadania);
  const procent = Math.round((wykonane / zadania.length) * 100);
  document.getElementById('wynik').textContent = `Wykonane: ${wykonane} z ${zadania.length} (${procent}%)`;
}

// 5. Poprawiłem clik na click
document.getElementById('policz').addEventListener('click', pokazPodsumowanie);