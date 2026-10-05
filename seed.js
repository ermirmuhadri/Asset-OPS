const db = require('./database');

db.serialize(() => {
  // Meglévő adatok törlése a tiszta újraitindításhoz
  db.run('DELETE FROM tickets');
  db.run('DELETE FROM assets');
  db.run('DELETE FROM users');
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('tickets', 'assets', 'users')");

  // 1. Felhasználók feltöltése
  const stmtUser = db.prepare('INSERT INTO users (name, email, role, department) VALUES (?, ?, ?, ?)');
  stmtUser.run('Ermir Muhadri', 'ermir@company.local', 'admin', 'IT Operations');
  stmtUser.run('Kovács Péter', 'peter.kovacs@company.local', 'technician', 'Helpdesk');
  stmtUser.run('Nagy Anna', 'anna.nagy@company.local', 'user', 'Marketing');
  stmtUser.finalize();

  // 2. Eszközök feltöltése
  const stmtAsset = db.prepare('INSERT INTO assets (name, type, serial_number, status, assigned_user_id) VALUES (?, ?, ?, ?, ?)');
  stmtAsset.run('Dell PowerEdge R750', 'server', 'SRV-2026-001', 'active', 1);
  stmtAsset.run('Cisco Catalyst 9300', 'switch', 'SW-2026-088', 'active', 1);
  stmtAsset.run('Lenovo ThinkPad X1', 'laptop', 'LAP-2026-102', 'in_repair', 3);
  stmtAsset.run('HP LaserJet Enterprise', 'printer', 'PRN-2026-044', 'in_stock', null);
  stmtAsset.finalize();

  // 3. Hibajegyek feltöltése
  const stmtTicket = db.prepare('INSERT INTO tickets (asset_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?)');
  stmtTicket.run(3, 'Kijelző villogás és túlmelegedés', 'A laptop kijelzője terhelés alatt vibrál, a ventilátor hangos.', 'high', 'in_progress');
  stmtTicket.run(2, 'Port 24 link drop hiba', 'A 24-es switch porton elmegy a kapcsolat 10 percenként.', 'critical', 'open');
  stmtTicket.run(1, 'RAID tömb karbantartás', 'Tervezett SMART állapot és lemez ellenőrzés.', 'low', 'closed');
  stmtTicket.finalize();

  console.log('Az AssetOps tesztadatok sikeresen betöltve!');
});