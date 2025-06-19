from transformers import pipeline
import pandas as pd
from collections import defaultdict
from openai import OpenAI
import os

# Load model once at module level
classifier = pipeline(
    task="text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)

# Mapping original model labels to simplified emotions
EMOTION_MAPPING = {
    "joy": "happiness",
    "sadness": "sadness",
    "anger": "frustration",
    "fear": "frustration",
    "disgust": "tiredness",
    "neutral": "neutral"
}

TARGET_EMOTIONS = ["happiness", "sadness", "frustration", "tiredness", "neutral"]

# OpenAI Client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def get_openai_response(summary_input: dict) -> str:
    """Send the emotion summary to GPT-4-turbo for interpretation."""
    prompt = (
        f"Here are the average emotion scores from employee messages:\n\n"
        f"{summary_input['average_emotion_scores']}\n\n"
        f"Here are the messages:\n" +
        "\n".join(f"- {msg}" for msg in summary_input['messages']) +
        "\n\nWrite a short paragraph summarizing the overall sentiment and provide a note to managers acknowledging the emotions and encouraging support."
    )

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are an empathetic HR assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

def map_scores(raw_scores):
    """Aggregate model scores into simplified emotion categories."""
    mapped = defaultdict(float)
    for item in raw_scores:
        label = item["label"]
        score = item["score"]
        simplified = EMOTION_MAPPING.get(label)
        if simplified:
            mapped[simplified] += score
    return {k: round(v, 4) for k, v in mapped.items()}

def processMessage(message: str) -> dict:
    scores = classifier(message)[0]
    mapped = map_scores(scores)
    return {
        "message": message,
        **mapped
    }

def summarizeMessages(messages: list) -> dict:
    """Summarize a list of messages with average emotion scores and get OpenAI response."""
    results = [processMessage(msg) for msg in messages]

    # Calculate averages
    totals = defaultdict(float)
    for r in results:
        for emotion in TARGET_EMOTIONS:
            totals[emotion] += r.get(emotion, 0.0)

    avg_scores = {k: round(v / len(results), 4) for k, v in totals.items()}
    messages_text = [r["message"] for r in results]

    summary_input = {
        "average_emotion_scores": avg_scores,
        "messages": messages_text
    }

    # Ask OpenAI for the summary
    gpt_output = get_openai_response(summary_input)

    return {
        "summary_input": summary_input,
        "openai_response": gpt_output
    }
