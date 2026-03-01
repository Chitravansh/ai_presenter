const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  pptFile: { type: String, default: null }, // 👈 ADD THIS LINE
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);