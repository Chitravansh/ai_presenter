// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import api from "../../services/api";
// import socket from "../../services/socket";

// export default function Audience() {
//   const { id } = useParams();
//   const [question, setQuestion] = useState("");

//   const sendQuestion = async () => {
//     if (!question) return;

//     await api.post("/questions", {
//       sessionId: id,
//       text: question,
//     });

//      // 🔥 Send realtime
//     socket.emit("send-question", {
//     sessionId: id,
//     question: question,
//   });

//     setQuestion("");
//     alert("Question sent!");
//   };

//   return (
//     <div className="flex flex-col h-screen p-6">

//       <h2 className="font-bold mb-4">Session ID: {id}</h2>

//       <input
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         className="border rounded-lg px-3 py-2 mb-2"
//         placeholder="Type your question..."
//       />

//       <button
//         onClick={sendQuestion}
//         className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//       >
//         Send
//       </button>

//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api"; // Adjust path if needed
import socket from "../../services/socket"; // Adjust path if needed

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

export default function Audience() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [pptFile, setPptFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [showCaptions, setShowCaptions] = useState(true); // Default to true
  const [fullTranscript, setFullTranscript] = useState(""); //Transcription
  const [reactions, setReactions] = useState([]);

  const slideRef = useRef(null);

  /* ======================
     Fetch Initial Data
  ====================== */
  const fetchSessionData = async () => {
    // 1. Fetch old questions
    try {
      const qRes = await api.get(`/questions/${id}`);
      if (qRes.data) {
        const formatted = qRes.data.map((q) => ({
          question: q.text,
          answer: q.answer,
        }));
        setQuestions(formatted);
      }
    } catch (error) {
      console.log("No previous questions found.");
    }

    // 2. Fetch the active presentation file
    try {
      const sessionRes = await api.get(`/upload/${id}`);
      if (sessionRes.data && sessionRes.data.pptFile) {
        setPptFile(sessionRes.data.pptFile);
      }
    } catch (error) {
      console.error("Failed to fetch presentation file");
    }
  };

  /* ======================
     Socket Sync
  ====================== */
  useEffect(() => {
    fetchSessionData();
    socket.emit("join-session", id);


    // Listen for AI answering questions
    const handleQuestion = (data) => {
      setQuestions((prev) => [...prev, data]);
      setIsAsking(false); // Stop loading spinner
    };

    const handleCaption = (data) => {
      setCaptionText(data.text);
      if (data.fullTranscript) {
        setFullTranscript(data.fullTranscript); // 👈 Save the full transcript locally!
      }
    };

    // Listen for Presenter changing slides
    const handleSlideChange = (newPage) => {
      setPageNumber(newPage);
    };

      const handleReaction = (emoji) => {
      const id = Date.now() + Math.random();
      // Give it a random horizontal position between 10% and 90%
      const leftPosition = Math.random() * 80 + 10; 
      
      setReactions((prev) => [...prev, { id, emoji, left: leftPosition }]);

      // Remove the emoji after 2 seconds (when the animation finishes)
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 2000);
    };

    
    
    // 👈 Add listener

    // Don't forget to clean it up in the return statement!
    // socket.off("receive-reaction", handleReaction);
    socket.on("receive-reaction", handleReaction);
    socket.on("receive-question", handleQuestion);
    socket.on("slide-changed", handleSlideChange);
    socket.on("receive-caption", handleCaption); // Caption reciever

    return () => {
      socket.off("receive-question", handleQuestion);
      socket.off("slide-changed", handleSlideChange);
      socket.off("receive-caption", handleCaption); //cleanup function for caption
      socket.off("receive-reaction", handleReaction);
    };
  }, [id]);

  /* ======================
     Ask AI a Question
  ====================== */
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsAsking(true);
    // Send the question to the server/AI
    socket.emit("send-question", { sessionId: id, question: newQuestion });
    
    // Clear the input box
    setNewQuestion(""); 
  };

  // 👇 Add this handler inside your socket useEffect
  

  /* ======================
     Download Transcript
  ====================== */
  const downloadTranscript = () => {
    if (!fullTranscript) {
      alert("No transcript data available yet.");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([`Session ${id} Transcript\n\n${fullTranscript}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Transcript_Session_${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendReaction = (emoji) => {
    socket.emit("send-reaction", { sessionId: id, reaction: emoji });
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center z-20">
        <div className="font-bold text-xl">
          Live Session <span className="text-blue-300 text-sm ml-2">Audience View</span>
        </div>
        <div className="flex gap-1">
        {/* 👇 New Download Button for Audience 👇 */}
          {fullTranscript && (
            <button 
              onClick={downloadTranscript} 
              className="px-4 py-2 bg-gray-100 text-blue-900 hover:bg-white rounded text-sm font-medium transition-colors shadow-sm"
            >
              📝 Save Transcript
            </button>
          )}
            <span/>
        {/* 👇 Add this button 👇 */}
        <button
          onClick={() => setShowCaptions(!showCaptions)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
        >
          {showCaptions ? "Hide Captions [CC]" : "Show Captions [CC]"}
        </button>
        </div>
        
      </nav>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT → SLIDES (View Only) */}
        <div className="w-1/2 border-r bg-gray-200 p-6 flex flex-col items-center justify-center overflow-y-auto relative">
          {pptFile ? (
            <div className="flex flex-col items-center w-full mt-4">
              <style>{`
                @keyframes floatUp {
                  0% { transform: translateY(0) scale(1); opacity: 1; }
                  100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
                }
                .floating-emoji {
                  animation: floatUp 2s ease-out forwards;
                  position: absolute;
                  bottom: 30px;
                  font-size: 2.5rem;
                  z-index: 50;
                  pointer-events: none;
                }
              `}</style>
              {/* Slide container - Strict 16:9 Aspect Ratio with overlay */}
              <div
                ref={slideRef}
                className="relative w-full max-w-5xl aspect-video bg-[#323639] rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-900/10 pointer-events-none"
              >
                {/* The pointer-events-none above completely prevents the audience from scrolling or clicking the PDF */}
                <iframe
                  key={pageNumber}
                  src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="slides"
                />

                {/* 👇 ADD CAPTION OVERLAY HERE 👇 */}
                {showCaptions && captionText && (
                  <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none">
                    <div className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg text-lg max-w-3xl text-center shadow-lg backdrop-blur-sm">
                      {captionText}
                    </div>
                  </div>
                )}

                {/* 👇 NEW: Floating Emojis Array 👇 */}
  {/* 👇 ADD THIS TO RENDER THE EMOJIS ON SCREEN 👇 */}
                {reactions.map((r) => (
                  <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
                    {r.emoji}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-gray-500 font-medium flex flex-col items-center">
                <span>Following Presenter • Slide {pageNumber}</span>
                
                {/* 👇 NEW: Reaction Buttons 👇 */}
                <div className="flex gap-4 mt-4 bg-white px-6 py-2 rounded-full shadow-md border border-gray-200 pointer-events-auto">
                  <button onClick={() => sendReaction("👍")} className="text-2xl hover:scale-125 transition-transform" title="Like">👍</button>
                  <button onClick={() => sendReaction("💡")} className="text-2xl hover:scale-125 transition-transform" title="Aha Moment">💡</button>
                  <button onClick={() => sendReaction("😕")} className="text-2xl hover:scale-125 transition-transform" title="Confused">😕</button>
                  <button onClick={() => sendReaction("👏")} className="text-2xl hover:scale-125 transition-transform" title="Applause">👏</button>
                </div>

              </div>
              <div className="mt-4 text-gray-500 font-medium">
                Following Presenter • Slide {pageNumber}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 w-full">
              <p className="text-lg">Waiting for presenter to upload slides...</p>
            </div>
          )}
        </div>

        {/* RIGHT → Q&A FEED & INPUT */}
        <div className="w-1/2 flex flex-col bg-white">
          
          {/* Scrollable Questions Feed */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Live Q&A</h2>

            {questions.length === 0 ? (
              <p className="text-gray-500 italic">No questions yet. Be the first to ask!</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                    <p className="font-semibold text-gray-800">Q: {q.question}</p>
                    {q.answer ? (
                      <p className="text-blue-700 mt-2 bg-blue-50 p-3 rounded border border-blue-100">
                        <span className="font-bold">AI:</span> {q.answer}
                      </p>
                    ) : (
                      <p className="text-gray-400 mt-2 italic text-sm">Waiting for AI to respond...</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Show a loading state when this specific user asks a question */}
            {isAsking && (
              <div className="mt-4 text-blue-600 font-medium animate-pulse">
                AI is analyzing the presentation to answer your question...
              </div>
            )}
          </div>

          {/* Question Input Box (Pinned to bottom) */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about the presentation..."
                className="flex-1 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                disabled={isAsking}
              />
              <button
                type="submit"
                disabled={isAsking || !newQuestion.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm disabled:opacity-50 transition"
              >
                Ask AI
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}