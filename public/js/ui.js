export const UI = {
  renderStats(stats) {
    document.getElementById('stat-total-assets').textContent = stats.total_assets || 0;
    document.getElementById('stat-repair-assets').textContent = stats.assets_in_repair || 0;
    document.getElementById('stat-open-tickets').textContent = stats.open_tickets || 0;
    document.getElementById('stat-critical-tickets').textContent = stats.critical_tickets || 0;
  },

  renderAssets(assets) {
    const tbody = document.getElementById('assets-table-body');
    if (!assets || assets.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading">Nincsenek eszközök.</td></tr>';
      return;
    }

    tbody.innerHTML = assets.map(a => `
      <tr>
        <td><strong>${a.name}</strong></td>
        <td>${a.type}</td>
        <td><code>${a.serial_number}</code></td>
        <td><span class="badge ${a.status}">${a.status}</span></td>
        <td>${a.assigned_user_name || '<em>Nincs kiosztva</em>'}</td>
      </tr>
    `).join('');
  },

  renderTickets(tickets) {
    const container = document.getElementById('tickets-list');
    if (!tickets || tickets.length === 0) {
      container.innerHTML = '<p class="loading">Nincsenek hibajegyek.</p>';
      return;
    }

    container.innerHTML = tickets.map(t => `
      <div class="ticket-item">
        <div class="ticket-title">
          <span>${t.title}</span>
          <span class="badge ${t.priority}">${t.priority}</span>
        </div>
        <div class="ticket-desc">${t.asset_name} (<code>${t.serial_number}</code>) — Státusz: <strong>${t.status}</strong></div>
      </div>
    `).join('');
  }
};