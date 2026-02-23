import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";

export default function Audience() {
  const { id } = useParams();
  const [question, setQuestion] = useState("");

  const sendQuestion = async () => {
    if (!question) return;

    await api.post("/questions", {
      sessionId: id,
      text: question,
    });

     // 🔥 Send realtime
    socket.emit("send-question", {
    sessionId: id,
    question: question,
  });

    setQuestion("");
    alert("Question sent!");
  };

  return (
    <div className="flex flex-col h-screen p-6">

      <h2 className="font-bold mb-4">Session ID: {id}</h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-2"
        placeholder="Type your question..."
      />

      <button
        onClick={sendQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>

    </div>
  );
}
