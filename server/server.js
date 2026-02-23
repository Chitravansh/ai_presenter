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

  socket.on("send-question", async ({ sessionId, question }) => {
    try {
      const answer = await askAI(question, sessionId);

      io.to(sessionId).emit("receive-question", {
        question,
        answer
      });

    } catch (err) {
      console.error(err);

      io.to(sessionId).emit("receive-question", {
        question,
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
