# Fraud AI — Real-Time Transaction Anomaly Detection

A full-stack application that detects fraudulent financial transactions using machine learning. The backend trains an Isolation Forest model on each user's transaction history to flag behavioral anomalies, while the frontend provides a live dashboard with time-series visualization.

## Architecture

```
Project1/
├── backend/          # Python FastAPI service
│   └── main.py       # REST API + ML inference (Isolation Forest)
└── fraud-detector/   # Next.js 16 frontend
    └── app/
        ├── page.tsx          # Main detection dashboard
        ├── nowcasting/       # Real-time monitoring page
        ├── forecasting/      # Predictive analytics page
        ├── pricing/          # Pricing page
        └── about/            # About page
```

## How It Works

1. A transaction (`user_id` + `amount` in KZT) is submitted via the frontend form.
2. The backend checks the user's transaction history in SQLite.
   - **< 10 transactions**: uses a pre-trained **Global Baseline** model (trained on 1,000 synthetic transactions between 2,000–5,000 KZT).
   - **≥ 10 transactions**: trains a **Personal Profile** model on the user's own history for personalized anomaly detection.
3. The result (`Normal` / `Fraudulent`) is returned alongside the full transaction history.
4. The frontend charts all transactions, highlights anomalies in red, and displays average value and standard deviation.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Recharts |
| Backend  | Python, FastAPI, scikit-learn (Isolation Forest), SQLite |

## Getting Started

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn scikit-learn numpy pydantic
python main.py
```

The API will be available at `http://localhost:8000`.

**Endpoint:**
```
POST /api/detect
Content-Type: application/json

{ "user_id": "client_01", "amount": 15000 }
```

### 2. Frontend

```bash
cd fraud-detector
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a **User ID** (e.g., `client_01`) and a **transaction amount** in KZT.
2. Click **Analyze** — the result appears instantly with a green (normal) or red (fraudulent) indicator.
3. The chart updates with each submission, showing your full transaction history with anomalies highlighted.
4. Use **Export CSV** to download an audit log of all transactions for the user.

## Key Features

- **Adaptive ML**: switches from a global baseline to a personal model once enough user history is available
- **Live chart**: transaction time-series with anomaly scatter overlay
- **Statistics panel**: average value and standard deviation per user
- **CSV export**: downloadable audit log named `<user_id>_audit_log.csv`
- **Persistent storage**: all transactions stored in SQLite (`backend/transactions.db`)
