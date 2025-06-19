import os
import anthropic

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def get_claude_response(summary: dict) -> str:
    prompt = f"""
You are a sentiment assistant. Given the following average emotion scores and messages:

Scores: {summary['average_emotion_scores']}
Messages: {summary['messages']}

Write:
1. A paragraph summarizing how the group is feeling overall.
2. A short motivational message for team leaders.
"""
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=400,
        temperature=0.7,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
