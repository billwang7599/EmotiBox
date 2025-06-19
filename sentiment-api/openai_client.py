import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_response(avg_scores: dict, messages: list) -> dict:
    emotion_block = f"Add this, Here are the average emotion scores:\n{avg_scores}"

    prompt = (
        f"{emotion_block}\n\n"
        "Here are the employee messages:\n" +
        "\n".join(f"- {msg}" for msg in messages) +
        "\n\nWrite ONE message to managers under 20 words, acknowledging these emotions and encouraging support. "
        "Do not include any summary of the messages."
    )

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an empathetic assistant for HR. "
                    "ONLY generate a message for managers under 20 words, based on the provided emotion data and messages. "
                    "Return only the manager message, nothing else."
                )
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.5
    )

    return {
        "manager_summary": response.choices[0].message["content"].strip(),
        "emotion_block": emotion_block
    }
