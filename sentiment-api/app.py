from fastapi import FastAPI, Request
from sentiment_model import processMessage, summarizeMessages

app = FastAPI()

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    message_id = data.get("id")
    message_text = data.get("text")

    if not message_id or not message_text:
        return {"error": "Missing 'id' or 'text' in request body."}

    result = processMessage(message_text)

    # No DB insert — returning result only
    return result

@app.post("/summarize")
async def summarize(request: Request):
    data = await request.json()
    messages = data.get("messages")

    if not messages or not isinstance(messages, list):
        return {"error": "Please provide a list of messages under the 'messages' key."}

    summary_result = summarizeMessages(messages)
    return summary_result
