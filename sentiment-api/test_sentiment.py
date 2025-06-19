from sentiment_model import processMessage, summarizeMessages

messages = [
    "I'm really happy with how this week went.",
]

# 🔍 Individual message analysis
print("\n🔍 Individual Message Analysis:\n")
for msg in messages:
    print(processMessage(msg))

# 📊 Overall sentiment summary
print("\n📊 Summary from OpenAI:\n")
summary = summarizeMessages(messages)
print(summary["openai_response"])
