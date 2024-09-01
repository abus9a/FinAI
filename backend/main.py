from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import IsolationForest
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("transactions.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            amount REAL,
            is_anomaly BOOLEAN
        )
    """)
    conn.commit()
    conn.close()

init_db()

global_model = IsolationForest(contamination=0.01, random_state=42)
global_training_data = np.random.uniform(2000, 5000, (1000, 1))
global_model.fit(global_training_data)

class Transaction(BaseModel):
    user_id: str
    amount: float

@app.post("/api/detect")
async def detect_fraud(transaction: Transaction):
    user_id = transaction.user_id
    amount = transaction.amount
    
    conn = sqlite3.connect("transactions.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT amount, is_anomaly FROM transactions WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    
    amounts_only = [row[0] for row in rows]
    
    if len(amounts_only) >= 10:
        X_train = np.array(amounts_only).reshape(-1, 1)
        personal_model = IsolationForest(contamination=0.05, random_state=42)
        personal_model.fit(X_train)
        
        X_test = np.array([[amount]])
        prediction = personal_model.predict(X_test)
        is_anomaly = bool(prediction[0] == -1)
        model_used = "Personal Profile"
    else:
        X_test = np.array([[amount]])
        prediction = global_model.predict(X_test)
        is_anomaly = bool(prediction[0] == -1)
        model_used = "Global Baseline"

    cursor.execute(
        "INSERT INTO transactions (user_id, amount, is_anomaly) VALUES (?, ?, ?)",
        (user_id, amount, is_anomaly)
    )
    conn.commit()
    
    cursor.execute("SELECT amount, is_anomaly FROM transactions WHERE user_id = ?", (user_id,))
    updated_rows = cursor.fetchall()
    conn.close()
    
    history = [
        {"index": i + 1, "amount": row[0], "is_anomaly": bool(row[1])}
        for i, row in enumerate(updated_rows)
    ]

    return {
        "user_id": user_id,
        "amount": amount,
        "is_anomaly": is_anomaly,
        "status": "Fraudulent" if is_anomaly else "Normal",
        "model_used": model_used,
        "history_length": len(history),
        "history": history
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)