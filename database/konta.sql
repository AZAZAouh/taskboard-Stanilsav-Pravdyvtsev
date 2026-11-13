CREATE USER IF NOT EXISTS 'taskboard_app'@'localhost' IDENTIFIED BY 'ZMIEŃ_HASŁO_APP';
CREATE USER IF NOT EXISTS 'taskboard_app'@'127.0.0.1' IDENTIFIED BY 'ZMIEŃ_HASŁO_APP';

CREATE USER IF NOT EXISTS 'taskboard_admin'@'localhost' IDENTIFIED BY 'ZMIEŃ_HASŁO_ADMIN';
CREATE USER IF NOT EXISTS 'taskboard_admin'@'127.0.0.1' IDENTIFIED BY 'ZMIEŃ_HASŁO_ADMIN';

CREATE USER IF NOT EXISTS 'taskboard_report'@'localhost' IDENTIFIED BY 'ZMIEŃ_HASŁO_REPORT';
CREATE USER IF NOT EXISTS 'taskboard_report'@'127.0.0.1' IDENTIFIED BY 'ZMIEŃ_HASŁO_REPORT';

GRANT SELECT, INSERT, UPDATE ON taskboard.* TO 'taskboard_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON taskboard.* TO 'taskboard_app'@'127.0.0.1';

GRANT SELECT, INSERT, UPDATE, DELETE ON taskboard.* TO 'taskboard_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON taskboard.* TO 'taskboard_admin'@'127.0.0.1';

GRANT SELECT ON taskboard.* TO 'taskboard_report'@'localhost';
GRANT SELECT ON taskboard.* TO 'taskboard_report'@'127.0.0.1';