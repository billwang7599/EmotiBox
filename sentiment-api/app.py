from fastapi import FastAPI, Request
from sentiment_model import processMessage, summarizeMessages

app = FastAPI()

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    message_text = data.get("text")
    print("recieved:", message_text)

    if not message_text:
        return {"error": "Missing 'id' or 'text' in request body."}

    result = processMessage(message_text)
    print(result)

    return result

@app.post("/summarize")
async def summarize(request: Request):
    data = await request.json()
    messages = data.get("messages")
    print(data)

    if not messages or not isinstance(messages, list):
        return {"error": "Please provide a list of messages under the 'messages' key."}

    summary_result, scores = summarizeMessages(messages)
    print(summary_result, scores)
    return {"summary": summary_result, "scores": scores}
