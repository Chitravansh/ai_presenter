const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const askAI = require("./services/ai.service");
const connectDB = require("./config/db");

const sessionRoutes = require("./routes/session.routes");
const questionRoutes = require("./routes/question.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const server = http.createServer(app);
const Question = require("./models/question.model");


/* ======================
   MIDDLEWARE
====================== */

app.use(cors());
app.use(express.json());

// 🔥 serve uploaded files for iframe preview
app.use("/uploads", express.static("uploads"));



/* ======================
   DB
====================== */

connectDB();



/* ======================
   ROUTES
====================== */

app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/upload", uploadRoutes);



/* ======================
   SOCKET.IO
====================== */

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-session", (id) => {
    socket.join(id);
  });

  socket.on("change-slide", ({ sessionId, pageNumber }) => {
    // socket.to() sends it to everyone in the room EXCEPT the presenter who changed it
    socket.to(sessionId).emit("slide-changed", pageNumber);
  });

  // 👇 Add this right below your "change-slide" socket event
  // socket.on("send-caption", ({ sessionId, text }) => {
  //   // Forward the live transcript to everyone watching
  //   socket.to(sessionId).emit("receive-caption", text);
  // });

  // Change it to accept 'data' and forward 'data' completely
  socket.on("send-caption", (data) => {
    socket.to(data.sessionId).emit("receive-caption", data);
  });

  // Send Reaction 
  // 👇 Add this right below your "send-caption" socket event
  socket.on("send-reaction", ({ sessionId, reaction }) => {
    // We use io.to() instead of socket.to() so the sender ALSO sees their own emoji float up!
    io.to(sessionId).emit("receive-reaction", reaction);
  });

  // socket.on("send-question", async ({ sessionId, question }) => {
  //   try {
  //     const answer = await askAI(question, sessionId);

  //     io.to(sessionId).emit("receive-question", {
  //       question,
  //       answer
  //     });

  //   } catch (err) {
  //     console.error(err);

  //     io.to(sessionId).emit("receive-question", {
  //       question,
  //       answer: "AI failed to answer"
  //     });
  //   }
  // });

  socket.on("send-question", async ({ sessionId, question }) => {
    try {
      // 1. Get the answer from your AI service
      const answer = await askAI(question, sessionId);

      // 2. 💾 SAVE TO DATABASE PERMANENTLY
      const newQuestion = new Question({
        sessionId: sessionId,
        text: question,
        answer: answer // Save the AI's response
      });
      await newQuestion.save();

      // 3. Broadcast to the presenter and the audience
      io.to(sessionId).emit("receive-question", {
        question: question,
        answer: answer
      });

    } catch (err) {
      console.error(err);

      // Fallback if AI fails
      io.to(sessionId).emit("receive-question", {
        question: question,
        answer: "AI failed to answer"
      });
    }
  });
});



/* ======================
   START
====================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
