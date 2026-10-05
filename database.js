const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'it_assets.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Adatbázis csatlakozási hiba:', err.message);
  } else {
    console.log('Sikeres csatlakozás az SQLite adatbázishoz.');
  }
});

db.serialize(() => {
  // 1. Idegen kulcs kényszerek bekapcsolása (SQLite-ban alapértelmezetten ki van kapcsolva)
  db.run('PRAGMA foreign_keys = ON;');

  // 2. USERS tábla
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN ('admin', 'technician', 'user')) DEFAULT 'user',
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. ASSETS tábla (Eszközök)
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- pl. 'laptop', 'server', 'switch', 'monitor'
      serial_number TEXT UNIQUE NOT NULL,
      status TEXT CHECK(status IN ('active', 'in_repair', 'retired', 'in_stock')) DEFAULT 'in_stock',
      assigned_user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // 4. TICKETS tábla (Hibajegyek)
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
      status TEXT CHECK(status IN ('open', 'in_progress', 'closed')) DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
    )
  `);

  console.log('Az adatbázis sémák (users, assets, tickets) sikeresen létrejöttek.');
});

module.exports = db;