# Diagram ERD bazy TaskBoard

Struktura obowiązuje wszystkich w projekcie. Pola są w camelCase, nazwy tabel małymi literami. Diagram wyświetla się na GitHubie (Mermaid).

```mermaid
erDiagram
    users ||--o{ boards : "tworzy (ownerId)"
    boards ||--o{ tasks : "zawiera (boardId)"
    users |o--o{ tasks : "jest przypisany (assigneeId)"
    users |o--o{ boards : "usuwa (deletedById)"
    users |o--o{ tasks : "usuwa (deletedById)"

    users {
        int id PK
        varchar login UK "3-30 znaków"
        char passwordHash "hash bcrypt, 60 znaków"
        varchar firstName
        varchar lastName
        datetime createdAt
    }
    boards {
        int id PK
        varchar name "1-80 znaków"
        varchar description "opcjonalny"
        int ownerId FK
        datetime createdAt
        tinyint isDeleted "domyślnie 0"
        datetime deletedAt "puste dla aktywnych"
        int deletedById FK "puste dla aktywnych"
    }
    tasks {
        int id PK
        varchar title "3-100 znaków"
        text description "opcjonalny"
        enum status "todo, in_progress, done"
        enum priority "low, medium, high"
        date deadline "opcjonalny"
        int boardId FK
        int assigneeId FK "opcjonalny"
        datetime createdAt
        tinyint isDeleted "domyślnie 0"
        datetime deletedAt
        int deletedById FK
    }
```

**Soft delete:** usunięcie ustawia naraz `isDeleted = 1`, `deletedAt` i `deletedById`; aplikacja pokazuje tylko rekordy z `isDeleted = 0`.
