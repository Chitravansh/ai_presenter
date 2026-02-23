const router = require("express").Router();
const Question = require("../models/question.model"); // FIXED

router.post("/", async (req, res) => {
  const { sessionId, text } = req.body;
  const q = await Question.create({ sessionId, text });
  res.json(q);
});

router.get("/:sessionId", async (req, res) => {
  const data = await Question.find({ sessionId: req.params.sessionId });
  res.json(data);
});

module.exports = router;
