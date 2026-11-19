-- W istniejącej bazie uruchom po migracji 003, jako administrator.
ALTER TABLE users MODIFY COLUMN role ENUM('user','viewer','editor','admin') NOT NULL DEFAULT 'viewer';
UPDATE users SET role = 'viewer' WHERE role = 'user';
-- Konta z materiałów pozostają demonstracyjnymi kontami do pracy nad zadaniami.
UPDATE users SET role = 'editor' WHERE login IN ('anna.nowak','jan.kowalski','ola.wisniewska','piotr.zielinski','kasia.lewandowska') AND role = 'viewer';
ALTER TABLE users MODIFY COLUMN role ENUM('viewer','editor','admin') NOT NULL DEFAULT 'viewer';
