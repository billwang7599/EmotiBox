from sentiment_model import processMessage, summarizeMessages

# Example messages to test
messages = [
    "I'm really happy with how this week went.",
    "I feel drained and exhausted.",
    "This deadline is stressing me out.",
    "I'm feeling pretty neutral today.",
    "I'm sad that my idea was rejected."
]

# 🔍 Individual Message Analysis
print("🔍 Individual Message Analysis:\n")
for msg in messages:
    result = processMessage(msg)
    print(result)

# 📊 Summary of All Messages
print("\n📊 Summary of All Messages:\n")
summary = summarizeMessages(messages)
print(summary["openai_response"])
