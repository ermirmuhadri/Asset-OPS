require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Standardized API Response Helper
const sendResponse = (res, statusCode, success, data = null, message = null) => {
  return res.status(statusCode).json({ success, data, message });
};

// 1. DASHBOARD STATS ENDPOINT
app.get('/api/stats', (req, res, next) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM assets) as total_assets,
      (SELECT COUNT(*) FROM assets WHERE status = 'in_repair') as assets_in_repair,
      (SELECT COUNT(*) FROM tickets WHERE status != 'closed') as open_tickets,
      (SELECT COUNT(*) FROM tickets WHERE priority = 'critical' AND status != 'closed') as critical_tickets
  `;
  db.get(query, [], (err, row) => {
    if (err) return next(err);
    sendResponse(res, 200, true, row);
  });
});

// 2. ASSETS ENDPOINTS
app.get('/api/assets', (req, res, next) => {
  const sql = `
    SELECT a.*, u.name as assigned_user_name 
    FROM assets a 
    LEFT JOIN users u ON a.assigned_user_id = u.id
    ORDER BY a.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return next(err);
    sendResponse(res, 200, true, rows);
  });
});

app.post('/api/assets', (req, res, next) => {
  const { name, type, serial_number, status, assigned_user_id } = req.body;

  if (!name || !type || !serial_number) {
    return sendResponse(res, 400, false, null, 'Validation error: Name, type, and serial number are required.');
  }

  const sql = 'INSERT INTO assets (name, type, serial_number, status, assigned_user_id) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [name, type, serial_number, status || 'in_stock', assigned_user_id || null], function (err) {
    if (err) return next(err);
    sendResponse(res, 201, true, { id: this.lastID, name, type, serial_number, status }, 'Asset created successfully.');
  });
});

// 3. TICKETS ENDPOINTS
app.get('/api/tickets', (req, res, next) => {
  const sql = `
    SELECT t.*, a.name as asset_name, a.serial_number 
    FROM tickets t 
    JOIN assets a ON t.asset_id = a.id
    ORDER BY t.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return next(err);
    sendResponse(res, 200, true, rows);
  });
});

app.post('/api/tickets', (req, res, next) => {
  const { asset_id, title, description, priority } = req.body;

  if (!asset_id || !title || !description) {
    return sendResponse(res, 400, false, null, 'Validation error: Asset ID, title, and description are required.');
  }

  const sql = 'INSERT INTO tickets (asset_id, title, description, priority) VALUES (?, ?, ?, ?)';
  db.run(sql, [asset_id, title, description, priority || 'medium'], function (err) {
    if (err) return next(err);
    sendResponse(res, 201, true, { id: this.lastID, asset_id, title, priority }, 'Ticket created successfully.');
  });
});

app.patch('/api/tickets/:id/status', (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const validStatuses = ['open', 'in_progress', 'closed'];

  if (!validStatuses.includes(status)) {
    return sendResponse(res, 400, false, null, 'Invalid status value. Allowed: open, in_progress, closed.');
  }

  const sql = 'UPDATE tickets SET status = ? WHERE id = ?';
  db.run(sql, [status, id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return sendResponse(res, 404, false, null, 'Ticket not found.');
    sendResponse(res, 200, true, { id, status }, 'Ticket status updated.');
  });
});

// Centralized Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  sendResponse(res, 500, false, null, err.message || 'Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`AssetOps Server active at http://localhost:${PORT}`);
});