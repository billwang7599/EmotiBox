from fastapi import FastAPI, Request
from sentiment_model import processMessage
import psycopg2

app = FastAPI()

def insert_message_to_db(message_id, message, emotion, intensity):
    conn = psycopg2.connect(
        host="YOUR_EC2_PUBLIC_IP",
        port=5432,
        database="your_db_name",
        user="your_username",
        password="your_password"
    )
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO messages (message_id, message, emotion, intensity)
        VALUES (%s, %s, %s, %s)
    """, (message_id, message, emotion, intensity))
    conn.commit()
    cur.close()
    conn.close()

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    message_id = data["id"]
    message_text = data["text"]
    
    result = processMessage(message_text)

    # Save to DB
    insert_message_to_db(
        message_id,
        result["message"],
        result["emotion"],
        result["intensity"]
    )

    return result
