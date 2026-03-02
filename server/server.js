const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const { askAI, generateRecommendations } = require("./services/ai.service");
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
app.get("/", (req, res) => {
  res.send("AI Presenter Backend is running 🚀");
});



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
  // socket.on("send-reaction", ({ sessionId, reaction }) => {
  //   // We use io.to() instead of socket.to() so the sender ALSO sees their own emoji float up!
  //   io.to(sessionId).emit("receive-reaction", reaction);
  // });

  // 👇 UPDATED: Broadcast the emoji AND save it to the database
  socket.on("send-reaction", async ({ sessionId, reaction }) => {
    // 1. Send it to the screens
    io.to(sessionId).emit("receive-reaction", reaction);

    // 2. Map the emoji to the database field
    const reactionMap = { 
      "👍": "likes", 
      "💡": "aha", 
      "😕": "confused", 
      "👏": "applause" 
    };
    
    const dbField = reactionMap[reaction];

    // 3. Increment the count in MongoDB
    if (dbField) {
      try {
        const Session = require("./models/session.model"); // Ensure Session model is imported
        await Session.findOneAndUpdate(
          { sessionId: sessionId },
          { $inc: { [`analytics.${dbField}`]: 1 } } // $inc adds 1 to the current number
        );
      } catch (err) {
        console.error("Failed to save reaction analytics:", err);
      }
    }
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

  // // 👇 NEW: Dynamic Content Recommendation Event 👇
  // socket.on("get-recommendations", async ({ sessionId, currentText }) => {
  //   try {
  //     // 1. Ask your AI to generate suggestions based on the presenter's speech
  //     // (You might need to adjust your askAI prompt to return a JSON array of suggestions)
  //     const prompt = `Based on this presentation text: "${currentText}", suggest 3 highly relevant topics, articles, or concepts the audience should explore. Format your response as a simple list.`;
      
  //     const recommendations = await askAI(prompt, sessionId);

  //     // 2. Broadcast the AI's recommendations to the audience and presenter
  //     io.to(sessionId).emit("receive-recommendations", recommendations);
      
  //   } catch (err) {
  //     console.error("AI Recommendation Error:", err);
  //   }
  // });

  // 👇 UPDATED: Dynamic Content Recommendation Event 👇
  socket.on("get-recommendations", async ({ sessionId, currentText }) => {
    try {
      // We now call the NEW function instead of askAI!
      const recommendations = await generateRecommendations(currentText);

      io.to(sessionId).emit("receive-recommendations", recommendations);
      
    } catch (err) {
      console.error("AI Recommendation Error:", err);
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
