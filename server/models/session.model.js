// const mongoose = require("mongoose");

// const sessionSchema = new mongoose.Schema({
//   sessionId: String,
//   pptFile: { type: String, default: null }, // 👈 ADD THIS LINE
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  pptFile: { type: String, default: null },
  // 👇 ADD THIS ANALYTICS OBJECT 👇
  analytics: {
    likes: { type: Number, default: 0 },      // 👍
    aha: { type: Number, default: 0 },        // 💡
    confused: { type: Number, default: 0 },   // 😕
    applause: { type: Number, default: 0 }    // 👏
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);