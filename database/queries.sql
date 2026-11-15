USE taskboard;

-- 1. Wyświetla aktywne zadania od najnowszego.
SELECT id, title, status, priority, createdAt
FROM tasks
WHERE isDeleted = 0
ORDER BY createdAt DESC, id DESC;

-- 2. Wyświetla aktywne zadania o wysokim priorytecie.
SELECT id, title, status
FROM tasks
WHERE isDeleted = 0 AND priority = 'high'
ORDER BY id;

-- 3. Wyświetla aktywne zadania z tablicy o ID 3.
SELECT id, title, status, priority
FROM tasks
WHERE boardId = 3 AND isDeleted = 0
ORDER BY id;

-- 4. Wyświetla aktywne zadania bez przypisanego użytkownika.
SELECT id, title, boardId
FROM tasks
WHERE isDeleted = 0 AND assigneeId IS NULL
ORDER BY id;

-- 5. Wyświetla zadania usunięte miękko ponad 30 dni temu.
SELECT id, title, deletedAt
FROM tasks
WHERE isDeleted = 1 AND deletedAt < NOW() - INTERVAL 30 DAY
ORDER BY deletedAt;

-- 6. Zlicza aktywne zadania według statusu.
SELECT status, COUNT(*) AS liczba_zadan
FROM tasks
WHERE isDeleted = 0
GROUP BY status
ORDER BY status;

-- 7. Wyświetla aktywne tablice i loginy ich właścicieli.
SELECT b.id, b.name, u.login AS wlasciciel
FROM boards AS b
JOIN users AS u ON u.id = b.ownerId
WHERE b.isDeleted = 0
ORDER BY b.id;

-- 8. Zlicza aktywne zadania na każdej aktywnej tablicy, także pustej.
SELECT b.id, b.name, COUNT(t.id) AS liczba_zadan
FROM boards AS b
LEFT JOIN tasks AS t ON t.boardId = b.id AND t.isDeleted = 0
WHERE b.isDeleted = 0
GROUP BY b.id, b.name
ORDER BY b.id;

-- 9. Wyświetla aktywne zadania i loginy przypisanych użytkowników.
SELECT t.id, t.title, u.login AS przypisany_uzytkownik
FROM tasks AS t
JOIN users AS u ON u.id = t.assigneeId
WHERE t.isDeleted = 0
ORDER BY t.id;

-- 10. Zlicza wszystkie, aktywne i miękko usunięte zadania.
SELECT COUNT(*) AS wszystkie,
       COUNT(CASE WHEN isDeleted = 0 THEN 1 END) AS aktywne,
       COUNT(CASE WHEN isDeleted = 1 THEN 1 END) AS usuniete_miekko
FROM tasks;