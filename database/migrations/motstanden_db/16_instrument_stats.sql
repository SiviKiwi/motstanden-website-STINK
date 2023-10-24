-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('16_instrument_stats.sql');


CREATE TABLE instrument_stats (
    instrument_id INTEGER PRIMARY KEY NOT NULL,
    instrument_name TEXT NOT NULL,
    loudness INTEGER NOT NULL,
    sourpercentage INTEGER NOT NULL,
    stat_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
