
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message",
      });
    }

    // Keep only the last 10 valid conversation messages
    const previousMessages = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string" &&
              item.content.trim()
          )
          .slice(-10)
          .map((item) => ({
            role: item.role,
            content: item.content,
          }))
      : [];

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are AgriNova AI, a friendly and intelligent
agriculture and smart greenhouse assistant.

LANGUAGE RULE:
- Detect the language of the latest user message.
- Reply in exactly the same language.
- Support English, Hindi, Punjabi and Hinglish.
- Use natural, conversational language.

RESPONSE STYLE:
- Keep answers concise, clear and practical.
- Prefer 3-6 lines for ordinary questions.
- Use bullet points only when useful.
- Avoid unnecessary tables and lengthy explanations.
- Give detailed explanations only when requested.
- Understand and answer follow-up questions using conversation history.

DOMAIN:
Help with crop care, soil health, irrigation,
temperature, humidity and greenhouse management.
Never pretend to know live sensor readings unless
they are explicitly provided.
Avoid presenting uncertain agricultural figures
as universally applicable recommendations.`,
        },

        ...previousMessages,

        {
          role: "user",
          content: message.trim(),
        },
      ],

      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 500,
    });

    res.status(200).json({
      success: true,
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Chatbot Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to get AI response",
    });
  }
};

module.exports = { chatWithAI };
