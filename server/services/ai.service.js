const axios = require("axios");
const Slide = require("../models/slide.model");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function askAI(question, sessionId) {
  try {
    if (!question) {
      throw new Error("Question is required");
    }

    /* ======================
       Fetch Slides Context
    ====================== */
    const slides = await Slide.find({ sessionId });

    if (!slides.length) {
      return "No slides found for this session.";
    }

    const context = slides.map((s) => s.text).join("\n");

    /* ======================
       Call LLM
    ====================== */
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an AI presentation assistant. Answer ONLY using the provided slides content. If the answer is not in slides, reply exactly: Not covered in this presentation."
          },
          {
            role: "user",
            content: `Slides Content:\n${context}\n\nQuestion:\n${question}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const aiReply =
      response?.data?.choices?.[0]?.message?.content ||
      "No response generated.";

    return aiReply;

  } catch (error) {
    console.error("AI Service Error:", error.message);

    return "AI service is temporarily unavailable. Please try again.";
  }
}

module.exports = askAI;