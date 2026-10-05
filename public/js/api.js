export const API = {
  async getStats() {
    const res = await fetch('/api/stats');
    return res.json();
  },
  async getAssets() {
    const res = await fetch('/api/assets');
    return res.json();
  },
  async getTickets() {
    const res = await fetch('/api/tickets');
    return res.json();
  }
};