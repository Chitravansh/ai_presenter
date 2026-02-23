const router = require("express").Router();
const Session = require("../models/session.model"); // FIXED

router.post("/create", async (req, res) => {
  const id = Date.now().toString();
  const session = await Session.create({ sessionId: id });
  res.json(session);
});

module.exports = router;
