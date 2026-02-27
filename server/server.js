const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

require("dotenv").config();
const askAI = require("./services/ai.service"); // ✅ AI service import

/* ======================
   BASIC APP SETUP
====================== */
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

/* ======================
   DATABASE CONNECTION
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ======================
   QUESTION MODEL
====================== */
const QuestionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    text: { type: String, required: true },
    answer: { type: String }
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

/* ======================
   ENSURE UPLOAD FOLDER
====================== */
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ======================
   FILE UPLOAD SETUP
====================== */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}.pdf`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"), false);
    }
    cb(null, true);
  }
});

app.use("/uploads", express.static(uploadDir));

/* ======================
   ROUTES
====================== */

// Upload Slides
app.post("/upload/:sessionId", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    file: req.file.filename
  });
});

// Get Questions
app.get("/questions/:sessionId", async (req, res) => {
  try {
    const questions = await Question.find({
      sessionId: req.params.sessionId
    }).sort({ createdAt: 1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

// Ask Question (REAL AI)
app.post("/ask/:sessionId", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // 🔥 Call AI Service
    const aiAnswer = await askAI(question, req.params.sessionId);

    const savedQuestion = await Question.create({
      sessionId: req.params.sessionId,
      text: question,
      answer: aiAnswer
    });

    // Emit to session
    io.to(req.params.sessionId).emit("receive-question", {
      question,
      answer: aiAnswer
    });

    res.json(savedQuestion);

  } catch (error) {
    console.error("Ask route error:", error.message);
    res.status(500).json({ message: "Failed to process question" });
  }
});

/* ======================
   SOCKET LOGIC
====================== */
io.on("connection", (socket) => {

  console.log("🔌 User Connected:", socket.id);

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });

  socket.on("slide-change", ({ sessionId, page }) => {
    io.to(sessionId).emit("slide-updated", page);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });

});

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});