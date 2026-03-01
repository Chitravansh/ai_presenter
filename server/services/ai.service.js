// const axios = require("axios");
// const Slide = require("../models/slide.model");

// async function askAI(question, sessionId) {

//   const slides = await Slide.find({ sessionId });

//   const context = slides.map(s => s.text).join("\n");

//   const res = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "nvidia/nemotron-nano-12b-v2-vl:free",
//       messages: [
//         {
//           role: "system",
//           content:
//             "Answer ONLY using the provided slides. If not found say: Not covered in this presentation. And Just Give short answers in 60 words also ensure that you don't ry to bold or gighlight anything just give the simple answer in text. "
//         },
//         {
//           role: "user",
//           content: `Slides:\n${context}\n\nQuestion:\n${question}`
//         }
//       ]
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
//       }
//     }
//   );

//   return res.data.choices[0].message.content;
// }

// module.exports = askAI;

const axios = require("axios");
const Slide = require("../models/slide.model");

async function askAI(question, sessionId) {
  try {
    const slides = await Slide.find({ sessionId });
    const context = slides.map((s) => s.text).join("\n");

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "stepfun/step-3.5-flash:free",
        messages: [
          {
            role: "system",
            content:
              "Answer ONLY using the provided slides. If not found say: Not covered in this presentation. And Just Give short answers in 60 words also ensure that you don't ry to bold or gighlight anything just give the simple answer in text. And answer the question in the language in which it is asked . ",
          },
          {
            role: "user",
            content: `Slides:\n${context}\n\nQuestion:\n${question}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    // 🛡️ DEFENSIVE CHECK: Make sure 'choices' actually exists before reading it
    if (res.data && res.data.choices && res.data.choices.length > 0) {
      console.log(res.data);
      return res.data.choices[0].message.content;
    } else {
      // If choices is missing, log what OpenRouter ACTUALLY sent back
      console.error("⚠️ OPENROUTER UNEXPECTED RESPONSE:", JSON.stringify(res.data, null, 2));
      return "The AI is currently busy or returned an invalid response.";
    }

  } catch (error) {
    // 🛡️ CATCH HTTP ERRORS (like 429 Rate Limit, 401 Bad API Key, 413 Payload Too Large)
    console.error("❌ AI API ERROR:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    
    // Return a safe fallback message so your server doesn't crash
    return "Sorry, I am having trouble reaching the AI server right now.";
  }
}

module.exports = askAI;