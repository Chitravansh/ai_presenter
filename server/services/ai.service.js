const axios = require("axios");
const Slide = require("../models/slide.model");

async function askAI(question, sessionId) {

  const slides = await Slide.find({ sessionId });

  const context = slides.map(s => s.text).join("\n");

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      messages: [
        {
          role: "system",
          content:
            "Answer ONLY using the provided slides. If not found say: Not covered in this presentation. And Just Give short answers in 60 words also ensure that you don't ry to bold or gighlight anything just give the simple answer in text. "
        },
        {
          role: "user",
          content: `Slides:\n${context}\n\nQuestion:\n${question}`
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    }
  );

  return res.data.choices[0].message.content;
}

module.exports = askAI;
