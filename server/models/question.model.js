// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   sessionId: String,
//   text: String,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Question", questionSchema);

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  text: { type: String, required: true },
  answer: { type: String, default: null }, // 👈 MAKE SURE THIS LINE EXISTS!
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);
