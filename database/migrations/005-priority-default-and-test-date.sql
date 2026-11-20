-- Uruchom w istniejacej bazie TaskBoard jako administrator.
ALTER TABLE tasks ALTER COLUMN priority SET DEFAULT 'medium';

-- Korekta daty w znanym rekordzie testowym z dolaczonego dumpa.
-- Rzeczywisty czas usuniecia nie jest znany: przyjmujemy date utworzenia.
-- Warunki chronia inne zadania oraz dane zmienione po imporcie.
UPDATE tasks
SET deletedAt = createdAt
WHERE id = 2
  AND title = 'Test CRUD po zmianie'
  AND createdAt = '2026-11-13 17:19:51'
  AND isDeleted = 1
  AND deletedAt = '2026-10-15 19:39:36';
