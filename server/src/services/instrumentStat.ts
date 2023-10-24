import Database from "better-sqlite3";
import { InstrumentStat } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js";

export function getStats(limit?: number): InstrumentStat[] {

    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            instrument_id as id,
            instrument_name as instrument,
            loudness,
            sourpercentage,
            stat_date as statDate
        FROM
            instrument_stats
        ORDER BY stat_date DESC
        ${!!limit ? "LIMIT ?" : ""}`)
    const stats = !!limit ? stmt.all(limit) : stmt.all()
    db.close()
    return stats as InstrumentStat[]
}

export function insertStat(stat: InstrumentStat) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO
            instrument_stats(instrument_id, instrument_name, loudness, sourpercentage)
        VALUES (?, ?, ?, ?) `)
    stmt.run(stat.id, stat.instrument, stat.loudness, stat.sourpercentage)
    db.close();
}
