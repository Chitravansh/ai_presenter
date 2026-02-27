const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    slideNo: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate slide numbers in same session
slideSchema.index({ sessionId: 1, slideNo: 1 }, { unique: true });

module.exports = mongoose.model("Slide", slideSchema);