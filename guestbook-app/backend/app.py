# backend/app.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
import psycopg2
from typing import List
import os

app = FastAPI()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "guestbook")
DB_USER = os.getenv("DB_USER", "guestuser")
DB_PASS = os.getenv("DB_PASS", "guestpass")

def get_connection():
    return psycopg2.connect(
        host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS
    )

class Message(BaseModel):
    name: str
    message: str

@app.get("/api/messages")
def read_messages():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT name, message, created_at FROM messages ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{"name": r[0], "message": r[1], "created_at": str(r[2])} for r in rows]

@app.post("/api/messages")
def write_message(msg: Message):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO messages (name, message) VALUES (%s, %s)", (msg.name, msg.message))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "Message saved"}
