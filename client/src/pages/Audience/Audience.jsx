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

// import { useParams } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";
// import api from "../../services/api"; // Adjust path if needed
// import socket from "../../services/socket"; // Adjust path if needed

// const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

// export default function Audience() {
//   const { id } = useParams();

//   const [questions, setQuestions] = useState([]);
//   const [pptFile, setPptFile] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [newQuestion, setNewQuestion] = useState("");
//   const [isAsking, setIsAsking] = useState(false);
//   const [captionText, setCaptionText] = useState("");
//   const [showCaptions, setShowCaptions] = useState(true); // Default to true
//   const [fullTranscript, setFullTranscript] = useState(""); //Transcription
//   const [reactions, setReactions] = useState([]);
//   const [recommendations, setRecommendations] = useState("");

//   const slideRef = useRef(null);

//   /* ======================
//      Fetch Initial Data
//   ====================== */
//   const fetchSessionData = async () => {
//     // 1. Fetch old questions
//     try {
//       const qRes = await api.get(`/questions/${id}`);
//       if (qRes.data) {
//         const formatted = qRes.data.map((q) => ({
//           question: q.text,
//           answer: q.answer,
//         }));
//         setQuestions(formatted);
//       }
//     } catch (error) {
//       console.log("No previous questions found.");
//     }

//     // 2. Fetch the active presentation file
//     try {
//       const sessionRes = await api.get(`/upload/${id}`);
//       if (sessionRes.data && sessionRes.data.pptFile) {
//         setPptFile(sessionRes.data.pptFile);
//       }
//     } catch (error) {
//       console.error("Failed to fetch presentation file");
//     }
//   };

//   /* ======================
//      Socket Sync
//   ====================== */
//   useEffect(() => {
//     fetchSessionData();
//     socket.emit("join-session", id);

//     //Recommendations 
//     const handleRecommendations = (data) => setRecommendations(data);


//     // Listen for AI answering questions
//     const handleQuestion = (data) => {
//       setQuestions((prev) => [...prev, data]);
//       setIsAsking(false); // Stop loading spinner
//     };

//     const handleCaption = (data) => {
//       setCaptionText(data.text);
//       if (data.fullTranscript) {
//         setFullTranscript(data.fullTranscript); // 👈 Save the full transcript locally!
//       }
//     };

//     // Listen for Presenter changing slides
//     const handleSlideChange = (newPage) => {
//       setPageNumber(newPage);
//     };

//       const handleReaction = (emoji) => {
//       const id = Date.now() + Math.random();
//       // Give it a random horizontal position between 10% and 90%
//       const leftPosition = Math.random() * 80 + 10; 
      
//       setReactions((prev) => [...prev, { id, emoji, left: leftPosition }]);

//       // Remove the emoji after 2 seconds (when the animation finishes)
//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== id));
//       }, 2000);
//     };

    
    
//     // 👈 Add listener

//     // Don't forget to clean it up in the return statement!
//     // socket.off("receive-reaction", handleReaction);
//     socket.on("receive-reaction", handleReaction);
//     socket.on("receive-question", handleQuestion);
//     socket.on("slide-changed", handleSlideChange);
//     socket.on("receive-caption", handleCaption); // Caption reciever
//     socket.on("receive-recommendations", handleRecommendations);

//     return () => {
//       socket.off("receive-question", handleQuestion);
//       socket.off("slide-changed", handleSlideChange);
//       socket.off("receive-caption", handleCaption); //cleanup function for caption
//       socket.off("receive-reaction", handleReaction);
//       socket.off("receive-recommendations", handleRecommendations);
//     };
//   }, [id]);

//   /* ======================
//      Ask AI a Question
//   ====================== */
//   const handleAskQuestion = (e) => {
//     e.preventDefault();
//     if (!newQuestion.trim()) return;

//     setIsAsking(true);
//     // Send the question to the server/AI
//     socket.emit("send-question", { sessionId: id, question: newQuestion });
    
//     // Clear the input box
//     setNewQuestion(""); 
//   };

//   // 👇 Add this handler inside your socket useEffect
  

//   /* ======================
//      Download Transcript
//   ====================== */
//   const downloadTranscript = () => {
//     if (!fullTranscript) {
//       alert("No transcript data available yet.");
//       return;
//     }

//     const element = document.createElement("a");
//     const file = new Blob([`Session ${id} Transcript\n\n${fullTranscript}`], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `Transcript_Session_${id}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const sendReaction = (emoji) => {
//     socket.emit("send-reaction", { sessionId: id, reaction: emoji });
//   };

//   // 👇 Helper function to make AI text links clickable
//   const formatLinks = (text) => {
//     if (!text) return null;
//     // Regex to detect http or https links
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
    
//     return text.split(urlRegex).map((part, i) => {
//       if (part.match(urlRegex)) {
//         return (
//           <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all">
//             {part}
//           </a>
//         );
//       }
//       return <span key={i}>{part}</span>;
//     });
//   };

//   /* ======================
//      UI
//   ====================== */
//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
      
//       {/* NAVIGATION BAR */}
//       <nav className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center z-20">
//         <div className="font-bold text-xl">
//           Live Session <span className="text-blue-300 text-sm ml-2">Audience View</span>
//         </div>
//         <div className="flex gap-1">
//         {/* 👇 New Download Button for Audience 👇 */}
//           {fullTranscript && (
//             <button 
//               onClick={downloadTranscript} 
//               className="px-4 py-2 bg-gray-100 text-blue-900 hover:bg-white rounded text-sm font-medium transition-colors shadow-sm"
//             >
//               📝 Save Transcript
//             </button>
//           )}
//             <span/>
//         {/* 👇 Add this button 👇 */}
//         <button
//           onClick={() => setShowCaptions(!showCaptions)}
//           className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
//         >
//           {showCaptions ? "Hide Captions [CC]" : "Show Captions [CC]"}
//         </button>
//         </div>
        
//       </nav>

//       {/* MAIN CONTENT SPLIT */}
//       <div className="flex flex-1 overflow-hidden">
        
//         {/* LEFT → SLIDES (View Only) */}
//         <div className="w-1/2 border-r bg-gray-200 p-6 flex flex-col items-center justify-center overflow-y-auto relative">
//           {pptFile ? (
//             <div className="flex flex-col items-center w-full mt-4">
//               <style>{`
//                 @keyframes floatUp {
//                   0% { transform: translateY(0) scale(1); opacity: 1; }
//                   100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
//                 }
//                 .floating-emoji {
//                   animation: floatUp 2s ease-out forwards;
//                   position: absolute;
//                   bottom: 30px;
//                   font-size: 2.5rem;
//                   z-index: 50;
//                   pointer-events: none;
//                 }
//               `}</style>
//               {/* Slide container - Strict 16:9 Aspect Ratio with overlay */}
//               <div
//                 ref={slideRef}
//                 className="relative w-full max-w-5xl aspect-video bg-[#323639] rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-900/10 pointer-events-none"
//               >
//                 {/* The pointer-events-none above completely prevents the audience from scrolling or clicking the PDF */}
//                 <iframe
//                   key={pageNumber}
//                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
//                   className="absolute inset-0 w-full h-full border-none"
//                   title="slides"
//                 />

//                 {/* 👇 ADD CAPTION OVERLAY HERE 👇 */}
//                 {showCaptions && captionText && (
//                   <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none">
//                     <div className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg text-lg max-w-3xl text-center shadow-lg backdrop-blur-sm">
//                       {captionText}
//                     </div>
//                   </div>
//                 )}

//                 {/* 👇 NEW: Floating Emojis Array 👇 */}
//   {/* 👇 ADD THIS TO RENDER THE EMOJIS ON SCREEN 👇 */}
//                 {reactions.map((r) => (
//                   <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
//                     {r.emoji}
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mt-4 text-gray-500 font-medium flex flex-col items-center">
//                 <span>Following Presenter • Slide {pageNumber}</span>
                
//                 {/* 👇 NEW: Reaction Buttons 👇 */}
//                 <div className="flex gap-4 mt-4 bg-white px-6 py-2 rounded-full shadow-md border border-gray-200 pointer-events-auto">
//                   <button onClick={() => sendReaction("👍")} className="text-2xl hover:scale-125 transition-transform" title="Like">👍</button>
//                   <button onClick={() => sendReaction("💡")} className="text-2xl hover:scale-125 transition-transform" title="Aha Moment">💡</button>
//                   <button onClick={() => sendReaction("😕")} className="text-2xl hover:scale-125 transition-transform" title="Confused">😕</button>
//                   <button onClick={() => sendReaction("👏")} className="text-2xl hover:scale-125 transition-transform" title="Applause">👏</button>
//                 </div>

//               </div>
//               <div className="mt-4 text-gray-500 font-medium">
//                 Following Presenter • Slide {pageNumber}
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center text-gray-500 w-full">
//               <p className="text-lg">Waiting for presenter to upload slides...</p>
//             </div>
//           )}
//         </div>

//         {/* RIGHT → Q&A FEED & INPUT */}
//         <div className="w-1/2 flex flex-col bg-white">

          
//           {/* Scrollable Questions Feed */}
//           <div className="flex-1 p-6 overflow-y-auto">
//                     {recommendations && (
//             <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 shadow-sm mx-6 mt-6">
//               <h2 className="text-lg font-bold text-indigo-900 mb-2">📚 Presenter's Suggested Reading</h2>
//               <div className="p-4 bg-white rounded shadow-inner text-gray-800 whitespace-pre-wrap text-sm border border-indigo-50">
//                 {/* 👇 The function is now wrapping the text to create links! 👇 */}
//                 {formatLinks(recommendations)}
//               </div>
//             </div>
//           )}
//             <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Live Q&A</h2>

//             {questions.length === 0 ? (
//               <p className="text-gray-500 italic">No questions yet. Be the first to ask!</p>
//             ) : (
//               <div className="space-y-4">
//                 {questions.map((q, i) => (
//                   <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
//                     <p className="font-semibold text-gray-800">Q: {q.question}</p>
//                     {q.answer ? (
//                       <p className="text-blue-700 mt-2 bg-blue-50 p-3 rounded border border-blue-100">
//                         <span className="font-bold">AI:</span> {q.answer}
//                       </p>
//                     ) : (
//                       <p className="text-gray-400 mt-2 italic text-sm">Waiting for AI to respond...</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             {/* Show a loading state when this specific user asks a question */}
//             {isAsking && (
//               <div className="mt-4 text-blue-600 font-medium animate-pulse">
//                 AI is analyzing the presentation to answer your question...
//               </div>
//             )}
//           </div>

//           {/* Question Input Box (Pinned to bottom) */}
//           <div className="p-4 bg-gray-50 border-t border-gray-200">
//             <form onSubmit={handleAskQuestion} className="flex gap-2">
//               <input
//                 type="text"
//                 value={newQuestion}
//                 onChange={(e) => setNewQuestion(e.target.value)}
//                 placeholder="Ask a question about the presentation..."
//                 className="flex-1 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//                 disabled={isAsking}
//               />
//               <button
//                 type="submit"
//                 disabled={isAsking || !newQuestion.trim()}
//                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm disabled:opacity-50 transition"
//               >
//                 Ask AI
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }







// import { useParams } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";
// import api from "../../services/api"; 
// import socket from "../../services/socket"; 

// const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

// export default function Audience() {
//   const { id } = useParams();

//   const [questions, setQuestions] = useState([]);
//   const [pptFile, setPptFile] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [newQuestion, setNewQuestion] = useState("");
//   const [isAsking, setIsAsking] = useState(false);
  
//   const [captionText, setCaptionText] = useState("");
//   const [showCaptions, setShowCaptions] = useState(true); 
//   const [fullTranscript, setFullTranscript] = useState(""); 
  
//   const [reactions, setReactions] = useState([]);
//   const [recommendations, setRecommendations] = useState("");
  
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

//   const slideRef = useRef(null);

//   /* ======================
//      Fetch Initial Data
//   ====================== */
//   const fetchSessionData = async () => {
//     try {
//       const qRes = await api.get(`/questions/${id}`);
//       if (qRes.data) {
//         const formatted = qRes.data.map((q) => ({
//           question: q.text,
//           answer: q.answer,
//         }));
//         setQuestions(formatted);
//       }
//     } catch (error) {
//       console.log("No previous questions found.");
//     }

//     try {
//       const sessionRes = await api.get(`/upload/${id}`);
//       if (sessionRes.data && sessionRes.data.pptFile) {
//         setPptFile(sessionRes.data.pptFile);
//       }
//     } catch (error) {
//       console.error("Failed to fetch presentation file");
//     }
//   };

//   /* ======================
//      Socket Sync
//   ====================== */
//   useEffect(() => {
//     fetchSessionData();
//     socket.emit("join-session", id);

//     const handleRecommendations = (data) => setRecommendations(data);

//     const handleQuestion = (data) => {
//       setQuestions((prev) => [...prev, data]);
//       setIsAsking(false); 
//     };

//     const handleCaption = (data) => {
//       setCaptionText(data.text);
//       if (data.fullTranscript) {
//         setFullTranscript(data.fullTranscript); 
//       }
//     };

//     const handleSlideChange = (newPage) => {
//       setPageNumber(newPage);
//     };

//     const handleReaction = (emoji) => {
//       const reactionId = Date.now() + Math.random();
//       const leftPosition = Math.random() * 80 + 10; 
      
//       setReactions((prev) => [...prev, { id: reactionId, emoji, left: leftPosition }]);

//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== reactionId));
//       }, 2000);
//     };

//     socket.on("receive-reaction", handleReaction);
//     socket.on("receive-question", handleQuestion);
//     socket.on("slide-changed", handleSlideChange);
//     socket.on("receive-caption", handleCaption); 
//     socket.on("receive-recommendations", handleRecommendations);

//     return () => {
//       socket.off("receive-question", handleQuestion);
//       socket.off("slide-changed", handleSlideChange);
//       socket.off("receive-caption", handleCaption); 
//       socket.off("receive-reaction", handleReaction);
//       socket.off("receive-recommendations", handleRecommendations);
//     };
//   }, [id]);

//   /* ======================
//      Ask AI a Question
//   ====================== */
//   const handleAskQuestion = (e) => {
//     e.preventDefault();
//     if (!newQuestion.trim()) return;

//     setIsAsking(true);
//     socket.emit("send-question", { sessionId: id, question: newQuestion });
//     setNewQuestion(""); 
//   };

//   /* ======================
//      Interactions
//   ====================== */
//   const downloadTranscript = () => {
//     if (!fullTranscript) {
//       alert("No transcript data available yet.");
//       return;
//     }
//     const element = document.createElement("a");
//     const file = new Blob([`Session ${id} Transcript\n\n${fullTranscript}`], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `Transcript_Session_${id}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//     setIsMobileMenuOpen(false);
//   };

//   const sendReaction = (emoji) => {
//     socket.emit("send-reaction", { sessionId: id, reaction: emoji });
//   };

//   const formatLinks = (text) => {
//     if (!text) return null;
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.split(urlRegex).map((part, i) => {
//       if (part.match(urlRegex)) {
//         return (
//           <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all font-medium">
//             {part}
//           </a>
//         );
//       }
//       return <span key={i}>{part}</span>;
//     });
//   };

//   /* ======================
//      UI Render
//   ====================== */
//   return (
//     <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans selection:bg-blue-200">
      
//       {/* HEADER / NAVIGATION */}
//       <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm transition-all duration-300">
//         <div className="max-w-[100rem] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
//           {/* Logo Section */}
//           <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-xl transition-transform group-hover:scale-105">
//               AI
//             </div>
//             <div className="flex flex-col">
//               <span className="hidden sm:block text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
//                 Present<span className="text-blue-600">Pro</span>
//               </span>
//               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
//                 Audience View • ID: {id.slice(-4)}
//               </span>
//             </div>
//           </div>
          
//           {/* Desktop Controls */}
//           <div className="hidden lg:flex items-center gap-3">
//             {fullTranscript && (
//               <button 
//                 onClick={downloadTranscript} 
//                 className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm"
//               >
//                 📝 Save Transcript
//               </button>
//             )}
//             <button
//               onClick={() => setShowCaptions(!showCaptions)}
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
//                 showCaptions ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               {showCaptions ? "👁️ Hide Captions" : "💬 Show Captions"}
//             </button>
//           </div>

//           {/* Mobile Burger Icon */}
//           <button 
//             className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isMobileMenuOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Dropdown Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full left-0 top-20 flex flex-col py-4 px-6 space-y-3 animate-fade-in z-50">
//             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Options</div>
//             <button 
//               onClick={() => { setShowCaptions(!showCaptions); setIsMobileMenuOpen(false); }} 
//               className={`w-full text-left px-4 py-3 rounded-xl font-medium ${showCaptions ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-700"}`}
//             >
//               {showCaptions ? "👁️ Hide Captions" : "💬 Show Captions"}
//             </button>
//             {fullTranscript && (
//               <button onClick={downloadTranscript} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-gray-50 text-gray-700">
//                 📝 Download Transcript
//               </button>
//             )}
//             <button 
//               onClick={() => window.location.href = '/'} 
//               className="w-full text-center mt-4 px-4 py-3 rounded-xl font-bold bg-gray-900 text-white shadow-md"
//             >
//               Leave Session
//             </button>
//           </div>
//         )}
//       </header>

//       {/* MAIN CONTENT SPLIT */}
//       <div className="flex flex-col lg:flex-row flex-1 mt-20 h-[calc(100vh-5rem)] overflow-hidden">
        
//         {/* LEFT → SLIDES AREA (View Only) */}
//         <div className="w-full lg:w-7/12 bg-[#FAFAFA] p-4 lg:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto lg:overflow-hidden h-[50vh] lg:h-full">
          
//           {pptFile ? (
//             <div className="flex flex-col items-center w-full max-w-5xl h-full justify-center">
              
//               <div className="w-full flex justify-between items-end mb-3 px-2">
//                 <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Live Presentation</span>
//                 <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Slide {pageNumber}</span>
//               </div>

//               {/* Slide container */}
//               <div
//                 ref={slideRef}
//                 className="relative w-full aspect-video bg-[#323639] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 pointer-events-none"
//               >
//                 <style>{`
//                   @keyframes floatUp {
//                     0% { transform: translateY(0) scale(1); opacity: 1; }
//                     100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
//                   }
//                   .floating-emoji {
//                     animation: floatUp 2s ease-out forwards;
//                     position: absolute;
//                     bottom: 30px;
//                     font-size: 2.5rem;
//                     z-index: 50;
//                     pointer-events: none;
//                   }
//                 `}</style>
                
//                 <iframe
//                   key={pageNumber}
//                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
//                   className="absolute inset-0 w-full h-full border-none"
//                   title="slides"
//                 />

//                 {/* Caption Overlay */}
//                 {showCaptions && captionText && (
//                   <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
//                     <div className="bg-gray-900/85 text-white px-6 py-3 rounded-2xl text-lg max-w-3xl text-center shadow-2xl backdrop-blur-md font-medium border border-white/10 tracking-wide">
//                       {captionText}
//                     </div>
//                   </div>
//                 )}

//                 {/* Floating Emojis */}
//                 {reactions.map((r) => (
//                   <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
//                     {r.emoji}
//                   </div>
//                 ))}
//               </div>

//               {/* Reaction Bar */}
//               <div className="flex items-center gap-3 lg:gap-4 mt-6 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100 pointer-events-auto transition-transform hover:shadow-md">
//                 <span className="text-sm font-bold text-gray-400 mr-2 uppercase tracking-wider hidden sm:block">React</span>
//                 <button onClick={() => sendReaction("👍")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Like">👍</button>
//                 <button onClick={() => sendReaction("💡")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Aha Moment">💡</button>
//                 <button onClick={() => sendReaction("😕")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Confused">😕</button>
//                 <button onClick={() => sendReaction("👏")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Applause">👏</button>
//               </div>

//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center text-gray-500 w-full animate-pulse">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                 <span className="text-4xl">⏳</span>
//               </div>
//               <p className="text-lg font-medium text-gray-600">Waiting for presenter to upload slides...</p>
//             </div>
//           )}
//         </div>

//         {/* RIGHT → INTERACTION AREA (Q&A) */}
//         <div className="w-full lg:w-5/12 bg-white flex flex-col h-[50vh] lg:h-full overflow-hidden relative">
          
//           <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-28 space-y-8">
            
//             {/* AI RECOMMENDATIONS PANEL */}
//             {recommendations && (
//               <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100/60 rounded-3xl p-6 shadow-sm animate-fade-in-up">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-10 -mt-10"></div>
//                 <div className="flex items-center gap-3 mb-4 relative z-10">
//                   <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shadow-sm">📚</div>
//                   <h2 className="text-lg font-bold text-indigo-950">Suggested Reading</h2>
//                 </div>
//                 <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10 text-sm">
//                   {formatLinks(recommendations)}
//                 </div>
//               </div>
//             )}

//             {/* LIVE Q&A LIST */}
//             <div>
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Live Q&A</h2>
//                 <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{questions.length} Questions</span>
//               </div>

//               {questions.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
//                   <span className="text-4xl mb-3 opacity-50">💬</span>
//                   <p className="text-gray-500 font-medium">No questions yet.</p>
//                   <p className="text-sm text-gray-400 mt-1">Be the first to ask the AI a question!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {questions.map((q, i) => (
//                     <div key={i} className="flex flex-col gap-2 animate-fade-in-up">
                      
//                       {/* User Question Bubble */}
//                       <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-[90%] relative shadow-sm">
//                         <span className="absolute -top-3 -left-3 text-xl bg-white rounded-full shadow-sm p-1">🙋</span>
//                         <p className="font-semibold text-gray-800 text-sm leading-relaxed ml-2">{q.question}</p>
//                       </div>
                      
//                       {/* AI Answer Bubble */}
//                       {q.answer ? (
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 p-4 rounded-2xl rounded-tr-sm self-end max-w-[90%] relative shadow-sm mt-1">
//                           <span className="absolute -top-3 -right-3 text-xl bg-white rounded-full shadow-sm p-1">🤖</span>
//                           <p className="text-blue-900 text-sm leading-relaxed mr-2 font-medium">{q.answer}</p>
//                         </div>
//                       ) : (
//                         <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tr-sm self-end relative shadow-sm mt-1 animate-pulse">
//                           <p className="text-gray-400 italic text-sm font-medium pr-2">Waiting for AI to reply...</p>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Question Input Box (Pinned to bottom via absolute positioning) */}
//           <div className="absolute bottom-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-20">
//             <form onSubmit={handleAskQuestion} className="flex gap-3 max-w-3xl mx-auto">
//               <input
//                 type="text"
//                 value={newQuestion}
//                 onChange={(e) => setNewQuestion(e.target.value)}
//                 placeholder="Ask a question about the presentation..."
//                 className="flex-1 px-5 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm transition-all"
//                 disabled={isAsking}
//               />
//               <button
//                 type="submit"
//                 disabled={isAsking || !newQuestion.trim()}
//                 className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap transform hover:scale-105 active:scale-95"
//               >
//                 {isAsking ? (
//                   <span className="animate-pulse">Asking...</span>
//                 ) : (
//                   <>Send <span className="hidden sm:inline">🚀</span></>
//                 )}
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>

//       {/* Tailwind Custom Animations */}
//       <style>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(15px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.4s ease-out forwards;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.2s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }





import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api"; 
import socket from "../../services/socket"; 

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

export default function Audience() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [pptFile, setPptFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  
  const [captionText, setCaptionText] = useState("");
  const [showCaptions, setShowCaptions] = useState(true); 
  const [fullTranscript, setFullTranscript] = useState(""); 
  
  const [reactions, setReactions] = useState([]);
  const [recommendations, setRecommendations] = useState("");
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const slideRef = useRef(null);
  
  // 👇 NEW: Reference to automatically scroll to the newest message
  const chatEndRef = useRef(null);

  /* ======================
     Fetch Initial Data
  ====================== */
  const fetchSessionData = async () => {
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

    const handleRecommendations = (data) => setRecommendations(data);

    const handleQuestion = (data) => {
      setQuestions((prev) => [...prev, data]);
      setIsAsking(false); 
    };

    const handleCaption = (data) => {
      setCaptionText(data.text);
      if (data.fullTranscript) {
        setFullTranscript(data.fullTranscript); 
      }
    };

    const handleSlideChange = (newPage) => {
      setPageNumber(newPage);
    };

    const handleReaction = (emoji) => {
      const reactionId = Date.now() + Math.random();
      const leftPosition = Math.random() * 80 + 10; 
      
      setReactions((prev) => [...prev, { id: reactionId, emoji, left: leftPosition }]);

      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reactionId));
      }, 2000);
    };

    socket.on("receive-reaction", handleReaction);
    socket.on("receive-question", handleQuestion);
    socket.on("slide-changed", handleSlideChange);
    socket.on("receive-caption", handleCaption); 
    socket.on("receive-recommendations", handleRecommendations);

    return () => {
      socket.off("receive-question", handleQuestion);
      socket.off("slide-changed", handleSlideChange);
      socket.off("receive-caption", handleCaption); 
      socket.off("receive-reaction", handleReaction);
      socket.off("receive-recommendations", handleRecommendations);
    };
  }, [id]);

  /* ======================
     Auto-Scroll to Bottom
  ====================== */
  useEffect(() => {
    // Whenever questions update, gently scroll to the bottom of the chat
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions, isAsking]);

  /* ======================
     Ask AI a Question
  ====================== */
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsAsking(true);
    socket.emit("send-question", { sessionId: id, question: newQuestion });
    setNewQuestion(""); 
  };

  /* ======================
     Interactions
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
    setIsMobileMenuOpen(false);
  };

  const sendReaction = (emoji) => {
    socket.emit("send-reaction", { sessionId: id, reaction: emoji });
  };

  const formatLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all font-medium">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  /* ======================
     UI Render
  ====================== */
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans selection:bg-blue-200">
      
      {/* HEADER / NAVIGATION */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-xl transition-transform group-hover:scale-105">
              AI
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:block text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
                Present<span className="text-blue-600">Pro</span>
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
                Audience View • ID: {id.slice(-4)}
              </span>
            </div>
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {fullTranscript && (
              <button 
                onClick={downloadTranscript} 
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                📝 Save Transcript
              </button>
            )}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
                showCaptions ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {showCaptions ? "👁️ Hide Captions" : "💬 Show Captions"}
            </button>
          </div>

          {/* Mobile Burger Icon */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full left-0 top-20 flex flex-col py-4 px-6 space-y-3 animate-fade-in z-50">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Options</div>
            <button 
              onClick={() => { setShowCaptions(!showCaptions); setIsMobileMenuOpen(false); }} 
              className={`w-full text-left px-4 py-3 rounded-xl font-medium ${showCaptions ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-700"}`}
            >
              {showCaptions ? "👁️ Hide Captions" : "💬 Show Captions"}
            </button>
            {fullTranscript && (
              <button onClick={downloadTranscript} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-gray-50 text-gray-700">
                📝 Download Transcript
              </button>
            )}
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full text-center mt-4 px-4 py-3 rounded-xl font-bold bg-gray-900 text-white shadow-md"
            >
              Leave Session
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-col lg:flex-row flex-1 mt-20 h-[calc(100vh-5rem)] overflow-hidden">
        
        {/* LEFT → SLIDES AREA (View Only) */}
        <div className="w-full lg:w-7/12 bg-[#FAFAFA] p-4 lg:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto lg:overflow-hidden h-[50vh] lg:h-full">
          
          {pptFile ? (
            <div className="flex flex-col items-center w-full max-w-5xl h-full justify-center">
              
              <div className="w-full flex justify-between items-end mb-3 px-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Live Presentation</span>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Slide {pageNumber}</span>
              </div>

              {/* Slide container */}
              <div
                ref={slideRef}
                className="relative w-full aspect-video bg-[#323639] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 pointer-events-none"
              >
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
                
                <iframe
                  key={pageNumber}
                  src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="slides"
                />

                {/* Caption Overlay */}
                {showCaptions && captionText && (
                  <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
                    <div className="bg-gray-900/85 text-white px-6 py-3 rounded-2xl text-lg max-w-3xl text-center shadow-2xl backdrop-blur-md font-medium border border-white/10 tracking-wide">
                      {captionText}
                    </div>
                  </div>
                )}

                {/* Floating Emojis */}
                {reactions.map((r) => (
                  <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Reaction Bar */}
              <div className="flex items-center gap-3 lg:gap-4 mt-6 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100 pointer-events-auto transition-transform hover:shadow-md">
                <span className="text-sm font-bold text-gray-400 mr-2 uppercase tracking-wider hidden sm:block">React</span>
                <button onClick={() => sendReaction("👍")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Like">👍</button>
                <button onClick={() => sendReaction("💡")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Aha Moment">💡</button>
                <button onClick={() => sendReaction("😕")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Confused">😕</button>
                <button onClick={() => sendReaction("👏")} className="text-3xl hover:scale-125 transition-transform hover:-translate-y-1" title="Applause">👏</button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 w-full animate-pulse">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">⏳</span>
              </div>
              <p className="text-lg font-medium text-gray-600">Waiting for presenter to upload slides...</p>
            </div>
          )}
        </div>

        {/* 👇 FIXED: RIGHT → INTERACTION AREA (Q&A) 👇 */}
        <div className="w-full lg:w-5/12 bg-white flex flex-col h-[50vh] lg:h-full overflow-hidden">
          
          {/* 1. Scrollable Questions Feed (Takes up remaining space) */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
            
            {/* AI RECOMMENDATIONS PANEL */}
            {recommendations && (
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100/60 rounded-3xl p-6 shadow-sm animate-fade-in-up">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shadow-sm">📚</div>
                  <h2 className="text-lg font-bold text-indigo-950">Suggested Reading</h2>
                </div>
                <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10 text-sm">
                  {formatLinks(recommendations)}
                </div>
              </div>
            )}

            {/* LIVE Q&A LIST */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Live Q&A</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{questions.length} Questions</span>
              </div>

              {questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                  <span className="text-4xl mb-3 opacity-50">💬</span>
                  <p className="text-gray-500 font-medium">No questions yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to ask the AI a question!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, i) => (
                    <div key={i} className="flex flex-col gap-2 animate-fade-in-up">
                      
                      {/* User Question Bubble */}
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-[90%] relative shadow-sm">
                        <span className="absolute -top-3 -left-3 text-xl bg-white rounded-full shadow-sm p-1">🙋</span>
                        <p className="font-semibold text-gray-800 text-sm leading-relaxed ml-2">{q.question}</p>
                      </div>
                      
                      {/* AI Answer Bubble */}
                      {q.answer ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 p-4 rounded-2xl rounded-tr-sm self-end max-w-[90%] relative shadow-sm mt-1">
                          <span className="absolute -top-3 -right-3 text-xl bg-white rounded-full shadow-sm p-1">🤖</span>
                          <p className="text-blue-900 text-sm leading-relaxed mr-2 font-medium">{q.answer}</p>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tr-sm self-end relative shadow-sm mt-1 animate-pulse">
                          <p className="text-gray-400 italic text-sm font-medium pr-2">Waiting for AI to reply...</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Invisible element to help auto-scroll to bottom */}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* 2. Question Input Box (Standard Flex Item, No longer overlaps!) */}
          <div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-20 shrink-0">
            <form onSubmit={handleAskQuestion} className="flex gap-3 max-w-3xl mx-auto">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about the presentation..."
                className="flex-1 px-5 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm transition-all"
                disabled={isAsking}
              />
              <button
                type="submit"
                disabled={isAsking || !newQuestion.trim()}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap transform hover:scale-105 active:scale-95"
              >
                {isAsking ? (
                  <span className="animate-pulse">Asking...</span>
                ) : (
                  <>Ask AI <span className="hidden sm:inline">🚀</span></>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Tailwind Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}