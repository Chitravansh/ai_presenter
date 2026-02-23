const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  sessionId: String,
  slideNo: Number,
  text: String
});

module.exports = mongoose.model("Slide", slideSchema);
