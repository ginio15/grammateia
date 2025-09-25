-- Schema for Offline Registry App
CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    issuer TEXT NOT NULL,
    referenceNumber TEXT NOT NULL,
    subject TEXT NOT NULL,
    recipient TEXT,
    offices TEXT,
    protocolNumber INTEGER NOT NULL,
    draftNumber INTEGER,
    entryDate TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    deletedFlag INTEGER NOT NULL DEFAULT 0,
    deletedAt TEXT
);

CREATE TABLE IF NOT EXISTS numbering_sequences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'protocol' or 'draft'
    category TEXT,      -- category for protocol; outgoing category for draft
    year INTEGER,       -- null for draft
    nextNumber INTEGER NOT NULL,
    lastUpdated TEXT
);

CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL, -- 'create' or 'delete'
    registrationId INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    username TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS archive_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,      -- YYYY-MM
    createdAt TEXT NOT NULL,
    itemsMoved INTEGER NOT NULL
);
