# AssetOps — Enterprise IT Asset & Service Desk System

AssetOps is a lightweight, modular IT Asset Management (ITAM) and Service Desk system built with Node.js, Express, SQLite, and Vanilla JavaScript. It simulates an operational IT-Ops dashboard for tracking enterprise hardware assets and managing technical support incidents.

## Key Features

- **KPI Analytics Dashboard:** Real-time operational metrics for total assets, repair status, open tickets, and critical incidents.
- **Hardware Asset Tracking:** Full lifecycle tracking (Status, Serial Number, Asset Type, User Assignment).
- **Service Desk Ticket System:** Incident logging linked directly to specific assets with priority levels (`low`, `medium`, `high`, `critical`).
- **Normalized SQLite Database:** Relational database design with explicit foreign key constraints connecting users, assets, and tickets.
- **Containerization Ready:** Fully dockerized setup with volume persistence for production environments.

## Tech Stack

- **Backend:** Node.js, Express.js, SQLite3 (`sqlite3`)
- **Security & Utilities:** `helmet`, `cors`, `dotenv`
- **Frontend:** Vanilla HTML5, CSS3 (CSS Grid & Flexbox), Modern JavaScript (ES Modules)
- **DevOps:** Docker, Docker Compose

## Project Structure

```text
ASSET-OPS/
├── database.js          # SQLite connection & schema initialization
├── seed.js              # Mock test data population script
├── server.js            # Express REST API endpoints & security middleware
├── package.json         # Dependencies & execution scripts
├── .env                 # Environment variables
├── .gitignore           # Git ignore configurations
├── Dockerfile           # Node alpine container setup
├── docker-compose.yml   # Docker orchestration & persistent storage setup
└── public/
    ├── index.html       # Dashboard SPA layout
    ├── styles.css       # Enterprise dark-themed UI styling
    └── js/
        ├── api.js       # HTTP Fetch API abstraction layer
        ├── ui.js        # DOM rendering & dynamic UI state handler
        └── app.js       # Client application entry point

```

## Getting Started

### Prerequisites

* Node.js (v18+)
* npm

### Installation & Local Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/asset-ops.git](https://github.com/your-username/asset-ops.git)
cd asset-ops

```


2. **Install dependencies:**
```bash
npm install

```


3. **Initialize database with mock test data:**
```bash
npm run seed

```


4. **Start the development server:**
```bash
npm run dev

```


5. **Access the application:**
Open `http://localhost:3000` in your browser.

---

### Docker Deployment

To run AssetOps as a containerized service with database volume persistence:

```bash
docker compose up -d --build

```

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/stats` | Fetches dashboard KPI summary counters |
| `GET` | `/api/assets` | Retrieves all registered IT assets with assigned users |
| `POST` | `/api/assets` | Registers a new asset in the system |
| `GET` | `/api/tickets` | Retrieves all service desk support tickets |
| `POST` | `/api/tickets` | Creates a new support ticket linked to an asset |
| `PATCH` | `/api/tickets/:id/status` | Updates ticket status (`open`, `in_progress`, `closed`) |

---

## Author

**Muhadri Ermire**

