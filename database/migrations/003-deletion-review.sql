-- Uruchom raz jako administrator w istniejącej bazie taskboard.
-- Żadne zadanie ani istniejące konto nie jest usuwane.
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') NOT NULL DEFAULT 'user';
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS purgeRequestedAt DATETIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS purgeRequestedById INT UNSIGNED DEFAULT NULL;
