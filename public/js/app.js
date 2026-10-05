import { API } from './api.js';
import { UI } from './ui.js';

async function initApp() {
  try {
    const [statsRes, assetsRes, ticketsRes] = await Promise.all([
      API.getStats(),
      API.getAssets(),
      API.getTickets()
    ]);

    if (statsRes.success) UI.renderStats(statsRes.data);
    if (assetsRes.success) UI.renderAssets(assetsRes.data);
    if (ticketsRes.success) UI.renderTickets(ticketsRes.data);
  } catch (err) {
    console.error('Hiba az Dashboard adatok betöltésekor:', err);
  }
}

document.addEventListener('DOMContentLoaded', initApp);