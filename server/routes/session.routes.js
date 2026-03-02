const router = require("express").Router();
const Session = require("../models/session.model"); // FIXED

// Make sure you import the Question model at the top!
const Question = require("../models/question.model"); 


/* ======================
   Create New Session
====================== */
router.post("/create", async (req, res) => {
  const id = Date.now().toString();
  const session = await Session.create({ sessionId: id });
  res.json(session);
});

// /* ======================
//    Get Session Analytics
// ====================== */
// router.get("/analytics/:sessionId", async (req, res) => {
//   try {
//     const session = await Session.findOne({ sessionId: req.params.sessionId });
    
//     if (!session) {
//       return res.status(404).json({ error: "Session not found" });
//     }

//     // If analytics exist, send them. Otherwise, send all zeros.
//     const analytics = session.analytics || { likes: 0, aha: 0, confused: 0, applause: 0 };
//     res.json(analytics);
    
//   } catch (err) {
//     console.error("Failed to fetch analytics:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

/* ======================
   Get Session Analytics
====================== */
router.get("/analytics/:sessionId", async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const analytics = session.analytics || { likes: 0, aha: 0, confused: 0, applause: 0 };

    // 1. 👇 Count the total questions asked in this session
    const questionsCount = await Question.countDocuments({ sessionId: req.params.sessionId });

    // 2. 👇 Calculate the Overall Sentiment
    const positiveScore = analytics.likes + analytics.aha + analytics.applause;
    const negativeScore = analytics.confused;
    
    let overallSentiment = "Neutral"; // Default state
    
    if (positiveScore === 0 && negativeScore === 0) {
      overallSentiment = "Neutral (No Reactions)";
    } else if (positiveScore > (negativeScore * 2)) {
      overallSentiment = "Highly Positive 🌟";
    } else if (positiveScore > negativeScore) {
      overallSentiment = "Positive 👍";
    } else if (negativeScore > positiveScore) {
      overallSentiment = "Confused / Needs Review ⚠️";
    }

    // 3. Send EVERYTHING to the frontend
    res.json({
      likes: analytics.likes,
      aha: analytics.aha,
      applause: analytics.applause,
      confused: analytics.confused,
      questionsAsked: questionsCount,
      overallSentiment: overallSentiment
    });
    
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
