// import { useParams } from "react-router-dom";
// import { useEffect, useState, useRef } from "react"; // ✅ added useRef
// import api from "../../services/api";
// import socket from "../../services/socket";

// const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000

// export default function Presenter() {
//   const { id } = useParams();

//   const [questions, setQuestions] = useState([]);
//   const [pptFile, setPptFile] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   const slideRef = useRef(null); // ✅ REQUIRED for fullscreen



//   /* ======================
//      Fetch old questions
//   ====================== */

//   const fetchQuestions = async () => {
//     const res = await api.get(`/questions/${id}`);

//     const formatted = res.data.map((q) => ({
//       question: q.text,
//       answer: null,
//     }));

//     setQuestions(formatted);
//   };



//   /* ======================
//      Upload slides
//   ====================== */

//   const uploadPPT = async (e) => {
//     const file = e.target.files[0];

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await api.post(`/upload/${id}`, formData);

//     setPptFile(res.data.file);
//     setPageNumber(1); // reset to first slide
//     alert("Slides uploaded!");
//   };



//   /* ======================
//      Socket realtime
//   ====================== */

//   useEffect(() => {
    
//     fetchQuestions();

//     socket.emit("join-session", id);

//     const handler = (data) => {
//       setQuestions((prev) => [...prev, data]);
//     };

//     socket.on("receive-question", handler);

//     return () => socket.off("receive-question", handler);
//   }, [id]);

//   /* ======================
//    Keyboard navigation
// ====================== */

// useEffect(() => {
//   const handleKey = (e) => {
//     if (!pptFile) return; // only after slides loaded

//     if (e.key === "ArrowRight") {
//       e.preventDefault();
//       setPageNumber(p => p + 1);
//     }

//     if (e.key === "ArrowLeft") {
//       e.preventDefault();
//       setPageNumber(p => Math.max(p - 1, 1));
//     }
//   };

//   window.addEventListener("keydown", handleKey);

//   return () => window.removeEventListener("keydown", handleKey);
// }, [pptFile]);




//   /* ======================
//      UI
//   ====================== */

//   return (
//     <div className="h-screen flex">

//       {/* LEFT → SLIDES */}
//       <div className="w-1/2 border-r bg-gray-50 p-3 flex flex-col items-center">

//         <input
//           type="file"
//           accept=".pdf"
//           onChange={uploadPPT}
//           className="mb-3"
//         />

//         {pptFile && (
//           <>
//             {/* Slide container */}
//             <div
//               ref={slideRef} // ✅ fullscreen target
//               className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow"
//             >
//               <iframe
//                 key={pageNumber}
//                 src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`}
//                 className="w-full h-full"
//                 title="slides"
//               />
//             </div>

//             {/* Controls */}
//             <div className="flex gap-3 mt-4">

//               <button
//                 onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 Prev
//               </button>

//               <span className="font-semibold">
//                 Slide {pageNumber}
//               </span>

//               <button
//                 onClick={() => setPageNumber(p => p + 1)}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 Next
//               </button>

//               <button
//                 onClick={() => slideRef.current?.requestFullscreen()} // ✅ works now
//                 className="px-3 py-1 bg-blue-600 text-white rounded"
//               >
//                 Fullscreen
//               </button>

//             </div>
//           </>
//         )}
//       </div>



//       {/* RIGHT → QUESTIONS */}
//       <div className="w-1/2 p-4 overflow-y-auto">
//         <h2 className="font-bold mb-4">Live Questions</h2>

//         {questions.map((q, i) => (
//           <div key={i} className="border p-3 my-2 rounded bg-white">
//             <p className="font-semibold">Q: {q.question}</p>

//             {q.answer && (
//               <p className="text-blue-600 mt-1">AI: {q.answer}</p>
//             )}
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }


// import { useParams } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";
// import api from "../../services/api";
// import socket from "../../services/socket";

// const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

// export default function Presenter() {
//   const { id } = useParams();

//   const [questions, setQuestions] = useState([]);
//   const [pptFile, setPptFile] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
  
//   // UI toggle states
//   const [showQR, setShowQR] = useState(false);
//   const [showShare, setShowShare] = useState(false);

//   const slideRef = useRef(null);

//   // Generate the link attendees will use to join
//   const joinLink = `${window.location.origin}/join/${id}`;

//   /* ======================
//      Sharing Functions
//   ====================== */
//   const copyLink = () => {
//     navigator.clipboard.writeText(joinLink);
//     alert("Session Link copied to clipboard!");
//   };

//   const copyId = () => {
//     navigator.clipboard.writeText(id);
//     alert("Session ID copied to clipboard!");
//   };

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Join my Live Session",
//           text: `Join my live presentation session using this link!`,
//           url: joinLink,
//         });
//       } catch (error) {
//         console.log("Error sharing natively:", error);
//       }
//     } else {
//       alert("Native sharing is not supported on this browser. Please use the copy links.");
//     }
//   };

//   // Pre-formatted links for explicit platforms
//   const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent("Join my live session here: " + joinLink)}`;
//   const mailLink = `mailto:?subject=${encodeURIComponent("Join my Live Session")}&body=${encodeURIComponent("Click the link below to join my live presentation:\n\n" + joinLink)}`;

//   /* ======================
//      Fetch old questions
//   ====================== */
//   const fetchQuestions = async () => {
//     try {
//       const res = await api.get(`/questions/${id}`);
//       const formatted = res.data.map((q) => ({
//         question: q.text,
//         answer: null,
//       }));
//       setQuestions(formatted);
//     } catch (error) {
//       console.error("Failed to fetch questions", error);
//     }
//   };

//   /* ======================
//      Upload slides
//   ====================== */
//   const uploadPPT = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await api.post(`/upload/${id}`, formData);
//       setPptFile(res.data.file);
//       setPageNumber(1);
//       alert("Slides uploaded!");
//     } catch (error) {
//       console.error("Failed to upload slides", error);
//       alert("Error uploading slides.");
//     }
//   };

//   /* ======================
//      Socket realtime
//   ====================== */
//   useEffect(() => {
//     fetchQuestions();

//     socket.emit("join-session", id);

//     const handler = (data) => {
//       setQuestions((prev) => [...prev, data]);
//     };

//     socket.on("receive-question", handler);

//     return () => socket.off("receive-question", handler);
//   }, [id]);

//   /* ======================
//      Keyboard navigation
//   ====================== */
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (!pptFile) return;

//       if (e.key === "ArrowRight") {
//         e.preventDefault();
//         setPageNumber((p) => p + 1);
//       }

//       if (e.key === "ArrowLeft") {
//         e.preventDefault();
//         setPageNumber((p) => Math.max(p - 1, 1));
//       }
//     };

//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [pptFile]);

//   /* ======================
//      UI
//   ====================== */
//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
      
//       {/* NAVIGATION BAR */}
//       <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative">
//         <div className="font-bold text-xl">
//           Live Session <span className="text-gray-400 text-sm ml-2">ID: {id}</span>
//         </div>
        
//         <div className="flex gap-3">
//           <button 
//             onClick={copyId} 
//             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
//           >
//             Copy ID
//           </button>
          
//           <button 
//             onClick={copyLink} 
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
//           >
//             Copy Link
//           </button>

//           {/* Share Button Toggle */}
//           <button 
//             onClick={() => { setShowShare(!showShare); setShowQR(false); }} 
//             className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors"
//           >
//             Share...
//           </button>
          
//           {/* QR Button Toggle */}
//           <button 
//             onClick={() => { setShowQR(!showQR); setShowShare(false); }} 
//             className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors"
//           >
//             {showQR ? "Hide QR" : "Show QR"}
//           </button>
//         </div>

//         {/* Share Dropdown */}
//         {showShare && (
//           <div className="absolute top-16 right-32 bg-white text-gray-800 p-2 rounded shadow-xl border z-50 flex flex-col min-w-[150px]">
//             <a 
//               href={whatsappLink} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-green-600"
//             >
//               WhatsApp
//             </a>
//             <a 
//               href={mailLink} 
//               className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-red-500"
//             >
//               Email
//             </a>
//             <div className="border-t my-1"></div>
//             <button 
//               onClick={handleNativeShare}
//               className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-left text-blue-600"
//             >
//               More Options...
//             </button>
//           </div>
//         )}

//         {/* QR Code Dropdown */}
//         {showQR && (
//           <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-xl border z-50 flex flex-col items-center">
//             <p className="text-gray-800 text-sm font-bold mb-2">Scan to Join</p>
//             <img 
//               src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} 
//               alt="Join QR Code" 
//               className="w-32 h-32"
//             />
//           </div>
//         )}
//       </nav>

//       {/* MAIN CONTENT SPLIT */}
//       <div className="flex flex-1 overflow-hidden">
        
//         {/* LEFT → SLIDES */}
//         <div className="w-1/2 border-r bg-gray-50 p-4 flex flex-col items-center overflow-y-auto">
//           <input
//             type="file"
//             accept=".pdf"
//             onChange={uploadPPT}
//             className="mb-4 block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />

//           {pptFile ? (
//             <>
//               {/* Slide container */}
//               <div
//                 ref={slideRef}
//                 className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow-lg"
//               >
//                 <iframe
//                   key={pageNumber}
//                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`}
//                   className="w-full h-full border-none"
//                   title="slides"
//                 />
//               </div>

//               {/* Controls */}
//               <div className="flex items-center gap-4 mt-6">
//                 <button
//                   onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition"
//                 >
//                   Prev
//                 </button>

//                 <span className="font-semibold text-lg">
//                   Slide {pageNumber}
//                 </span>

//                 <button
//                   onClick={() => setPageNumber((p) => p + 1)}
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition"
//                 >
//                   Next
//                 </button>

//                 <button
//                   onClick={() => slideRef.current?.requestFullscreen()}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition ml-4"
//                 >
//                   Fullscreen
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-400">
//               Upload a PDF to start presenting
//             </div>
//           )}
//         </div>

//         {/* RIGHT → QUESTIONS */}
//         <div className="w-1/2 p-6 bg-white overflow-y-auto">
//           <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Questions</h2>

//           {questions.length === 0 ? (
//             <p className="text-gray-500 italic">No questions yet. Share the link to get started!</p>
//           ) : (
//             <div className="space-y-4">
//               {questions.map((q, i) => (
//                 <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
//                   <p className="font-semibold text-gray-800">Q: {q.question}</p>
//                   {q.answer && (
//                     <p className="text-blue-700 mt-2 bg-blue-50 p-2 rounded">
//                       <span className="font-bold">AI:</span> {q.answer}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
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

// export default function Presenter() {
//   const { id } = useParams();

//   const [questions, setQuestions] = useState([]);
//   const [pptFile, setPptFile] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
  
//   const [showQR, setShowQR] = useState(false);
//   const [showShare, setShowShare] = useState(false);

//   const slideRef = useRef(null);

//   const joinLink = `${window.location.origin}/join/${id}`;

//   /* ======================
//      Sharing Functions
//   ====================== */
//   const copyLink = () => {
//     navigator.clipboard.writeText(joinLink);
//     alert("Session Link copied to clipboard!");
//   };

//   const copyId = () => {
//     navigator.clipboard.writeText(id);
//     alert("Session ID copied to clipboard!");
//   };

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Join my Live Session",
//           text: `Join my live presentation session using this link!`,
//           url: joinLink,
//         });
//       } catch (error) {
//         console.log("Error sharing natively:", error);
//       }
//     } else {
//       alert("Native sharing is not supported on this browser.");
//     }
//   };

//   const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent("Join my live session here: " + joinLink)}`;
//   const mailLink = `mailto:?subject=${encodeURIComponent("Join my Live Session")}&body=${encodeURIComponent("Click the link below to join my live presentation:\n\n" + joinLink)}`;

//   /* ======================
//      Fetch old questions
//   ====================== */
//   const fetchQuestions = async () => {
//     try {
//       const res = await api.get(`/questions/${id}`);
//       const formatted = res.data.map((q) => ({
//         question: q.text,
//         answer: null,
//       }));
//       setQuestions(formatted);
//     } catch (error) {
//       console.error("Failed to fetch questions", error);
//     }
//   };

//   /* ======================
//      Upload slides
//   ====================== */
//   const uploadPPT = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await api.post(`/upload/${id}`, formData);
//       setPptFile(res.data.file);
//       setPageNumber(1);
//       alert("Slides uploaded!");
//     } catch (error) {
//       console.error("Failed to upload slides", error);
//       alert("Error uploading slides.");
//     }
//   };

//   /* ======================
//      Socket realtime
//   ====================== */
//   useEffect(() => {
//     fetchQuestions();
//     socket.emit("join-session", id);

//     const handler = (data) => {
//       setQuestions((prev) => [...prev, data]);
//     };

//     socket.on("receive-question", handler);
//     return () => socket.off("receive-question", handler);
//   }, [id]);

//   /* ======================
//      Keyboard navigation
//   ====================== */
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (!pptFile) return;

//       if (e.key === "ArrowRight") {
//         e.preventDefault();
//         setPageNumber((p) => p + 1);
//       }

//       if (e.key === "ArrowLeft") {
//         e.preventDefault();
//         setPageNumber((p) => Math.max(p - 1, 1));
//       }
//     };

//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [pptFile]);

//   /* ======================
//      UI
//   ====================== */
//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
      
//       {/* NAVIGATION BAR */}
//       <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative z-20">
//         <div className="font-bold text-xl">
//           Live Session <span className="text-gray-400 text-sm ml-2">ID: {id}</span>
//         </div>
        
//         <div className="flex gap-3">
//           <button onClick={copyId} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
//             Copy ID
//           </button>
//           <button onClick={copyLink} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors">
//             Copy Link
//           </button>
//           <button onClick={() => { setShowShare(!showShare); setShowQR(false); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors">
//             Share...
//           </button>
//           <button onClick={() => { setShowQR(!showQR); setShowShare(false); }} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors">
//             {showQR ? "Hide QR" : "Show QR"}
//           </button>
//         </div>

//         {/* Share Dropdown */}
//         {showShare && (
//           <div className="absolute top-16 right-32 bg-white text-gray-800 p-2 rounded shadow-xl border z-50 flex flex-col min-w-[150px]">
//             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-green-600">WhatsApp</a>
//             <a href={mailLink} className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-red-500">Email</a>
//             <div className="border-t my-1"></div>
//             <button onClick={handleNativeShare} className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-left text-blue-600">More Options...</button>
//           </div>
//         )}

//         {/* QR Code Dropdown */}
//         {showQR && (
//           <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-xl border z-50 flex flex-col items-center">
//             <p className="text-gray-800 text-sm font-bold mb-2">Scan to Join</p>
//             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} alt="Join QR Code" className="w-32 h-32" />
//           </div>
//         )}
//       </nav>

//       {/* MAIN CONTENT SPLIT */}
//       <div className="flex flex-1 overflow-hidden">
        
//         {/* LEFT → SLIDES */}
//         <div className="w-1/2 border-r bg-gray-200 p-6 flex flex-col items-center justify-center overflow-y-auto relative">
          
//           {/* File Upload stays absolute at the top so it doesn't shift the presentation */}
//           <div className="absolute top-4 w-full flex justify-center z-10">
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={uploadPPT}
//               className="block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 file:shadow-sm hover:file:bg-blue-50"
//             />
//           </div>

//           {pptFile ? (
//             <div className="flex flex-col items-center w-full mt-12">
//               {/* Slide container - Strict 16:9 Aspect Ratio with overlay */}
//               <div
//                 ref={slideRef}
//                 className="relative w-full max-w-5xl aspect-video bg-[#323639] rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-900/10"
//               >
//                 {/* INVISIBLE OVERLAY: 
//                   This invisible div sits over the iframe. It prevents the user from clicking 
//                   or scrolling inside the native PDF viewer, forcing a static "slide" view.
//                 */}
//                 <div className="absolute inset-0 z-10 cursor-default" />

//                 <iframe
//                   key={pageNumber} // Re-renders cleanly on page change
//                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
//                   className="absolute inset-0 w-full h-full border-none"
//                   title="slides"
//                 />
//               </div>

//               {/* Controls */}
//               <div className="flex items-center gap-4 mt-6 bg-white p-3 rounded-full shadow-md">
//                 <button
//                   onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
//                   className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
//                 >
//                   Prev
//                 </button>

//                 <span className="font-semibold text-gray-700 min-w-[80px] text-center">
//                   Slide {pageNumber}
//                 </span>

//                 <button
//                   onClick={() => setPageNumber((p) => p + 1)}
//                   className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
//                 >
//                   Next
//                 </button>

//                 <div className="w-px h-6 bg-gray-300 mx-2"></div>

//                 <button
//                   onClick={() => slideRef.current?.requestFullscreen()}
//                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
//                 >
//                   Fullscreen
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center text-gray-500">
//               <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
//               <p className="text-lg">Upload a PDF to start presenting</p>
//             </div>
//           )}
//         </div>

//         {/* RIGHT → QUESTIONS */}
//         <div className="w-1/2 p-6 bg-white overflow-y-auto">
//           <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Questions</h2>

//           {questions.length === 0 ? (
//             <p className="text-gray-500 italic">No questions yet. Share the link to get started!</p>
//           ) : (
//             <div className="space-y-4">
//               {questions.map((q, i) => (
//                 <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
//                   <p className="font-semibold text-gray-800">Q: {q.question}</p>
//                   {q.answer && (
//                     <p className="text-blue-700 mt-2 bg-blue-50 p-2 rounded">
//                       <span className="font-bold">AI:</span> {q.answer}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import socket from "../../services/socket";

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

export default function Presenter() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [pptFile, setPptFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const [isCapturing, setIsCapturing] = useState(false);
  const [captionText, setCaptionText] = useState("");

  const [reactions, setReactions] = useState([]);

  const recognitionRef = useRef(null);

  const slideRef = useRef(null);

  // Add these right under your existing captionText state
  const [fullTranscript, setFullTranscript] = useState("");
  const fullTranscriptRef = useRef(""); // Keeps track of text inside the speech event

  const joinLink = `${window.location.origin}/join/${id}`;

  /* ======================
     Sharing Functions
  ====================== */
  const copyLink = () => {
    navigator.clipboard.writeText(joinLink);
    alert("Session Link copied to clipboard!");
  };

  const copyId = () => {
    navigator.clipboard.writeText(id);
    alert("Session ID copied to clipboard!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Live Session",
          text: `Join my live presentation session using this link!`,
          url: joinLink,
        });
      } catch (error) {
        console.log("Error sharing natively:", error);
      }
    } else {
      alert("Native sharing is not supported on this browser.");
    }
  };

  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent("Join my live session here: " + joinLink)}`;
  const mailLink = `mailto:?subject=${encodeURIComponent("Join my Live Session")}&body=${encodeURIComponent("Click the link below to join my live presentation:\n\n" + joinLink)}`;

  /* ======================
     Data Fetching & Deletion
  ====================== */
  // const fetchSessionData = async () => {
  //   try {
  //     // 1. Fetch Questions
  //     const qRes = await api.get(`/questions/${id}`);
  //     const formatted = qRes.data.map((q) => ({
  //       question: q.text,
  //       answer: null,
  //     }));
  //     setQuestions(formatted);

  //     // 2. Fetch Session Info (to see if a file is already uploaded)
  //     // *Make sure your backend has a route like GET /session/:id that returns the active file*
  //     const sessionRes = await api.get(`/session/${id}`);
  //     if (sessionRes.data && sessionRes.data.pptFile) {
  //       setPptFile(sessionRes.data.pptFile);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch session data", error);
  //   }
  // };

  /* ======================
     Data Fetching & Deletion
  ====================== */
  const fetchSessionData = async () => {
    
    // 1. Fetch Questions (Independent Block)
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
      console.log("No questions found yet or error fetching questions.");
      // It's okay if this fails, we just keep going!
    }

    // 2. Fetch Active Presentation File (Independent Block)
    try {
      console.log("Asking server for active presentation...");
      const sessionRes = await api.get(`/upload/${id}`);
      
      console.log("Server responded with:", sessionRes.data);
      
      if (sessionRes.data && sessionRes.data.pptFile) {
        setPptFile(sessionRes.data.pptFile);
      }
    } catch (error) {
      console.error("Failed to fetch session data", error);
    }
  };

  const uploadPPT = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(`/upload/${id}`, formData);
      setPptFile(res.data.file);
      setPageNumber(1);
    } catch (error) {
      console.error("Failed to upload slides", error);
      alert("Error uploading slides.");
    }
  };

  const deletePPT = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this presentation?");
    if (!confirmDelete) return;

    try {
      // *Make sure your backend has a route like DELETE /upload/:id*
      await api.delete(`/upload/${id}`);
      setPptFile(null);
      setPageNumber(1);
    } catch (error) {
      console.error("Failed to delete slides", error);
      alert("Error deleting presentation.");
    }
  };

  /* ======================
     Socket realtime
  ====================== */
  useEffect(() => {
    fetchSessionData();
    socket.emit("join-session", id);

    const handler = (data) => {
      setQuestions((prev) => [...prev, data]);
    };

    const handleReaction = (emoji) => {
      const reactionId = Date.now() + Math.random();
      const leftPosition = Math.random() * 80 + 10; 
      
      setReactions((prev) => [...prev, { id: reactionId, emoji, left: leftPosition }]);
      
      // Remove emoji after 2 seconds
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reactionId));
      }, 2000);
    };

    socket.on("receive-question", handler);
    socket.on("receive-reaction", handleReaction);
    return () =>{ socket.off("receive-question", handler);
                 socket.off("receive-reaction", handleReaction);
    }
  }, [id]);

  /* ======================
     Keyboard navigation
  ====================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (!pptFile) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPageNumber((p) => p + 1);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPageNumber((p) => Math.max(p - 1, 1));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pptFile]);


  /* ======================
     Broadcast Slide Changes
  ====================== */
  useEffect(() => {
    // Whenever the pageNumber changes, tell the server!
    socket.emit("change-slide", { sessionId: id, pageNumber });
  }, [pageNumber, id]);

  /* ======================
     Speech Recognition (Live Captions)
  ====================== */
  useEffect(() => {
    // Check if browser supports SpeechRecognition (Chrome/Edge/Safari)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening
      recognitionRef.current.interimResults = true; // Show words as they are spoken

      // recognitionRef.current.onresult = (event) => {
      //   let currentTranscript = "";
      //   for (let i = event.resultIndex; i < event.results.length; i++) {
      //     currentTranscript += event.results[i][0].transcript;
      //   }
        
      //   // Show on presenter's screen
      //   setCaptionText(currentTranscript);
      //   // Send to audience
      //   socket.emit("send-caption", { sessionId: id, text: currentTranscript });
      // };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscriptSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const textLine = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // If the browser is absolutely sure of the sentence, lock it in!
            finalTranscriptSegment += textLine + " ";
            fullTranscriptRef.current += textLine + " "; 
            setFullTranscript(fullTranscriptRef.current);
          } else {
            // If the browser is still guessing, keep it as interim
            interimTranscript += textLine;
          }
        }
        
        // What we show on screen: Interim (live guessing) OR the last final sentence
        const displayCaption = interimTranscript || finalTranscriptSegment;
        
        if (displayCaption) {
          setCaptionText(displayCaption);
          // 👇 Add fullTranscript to the data being sent
          socket.emit("send-caption", { sessionId: id, 
            text: displayCaption, 
            fullTranscript: fullTranscriptRef.current 
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setIsCapturing(false);
          alert("Microphone access was denied.");
        }
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [id]);

  const toggleCaptions = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support live captioning. Try Google Chrome.");
      return;
    }

    if (isCapturing) {
      recognitionRef.current.stop();
      setIsCapturing(false);
      setCaptionText("");
      socket.emit("send-caption", { sessionId: id, text: "" }); // Clear audience screen
    } else {
      try {
        recognitionRef.current.start();
        setIsCapturing(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  /* ======================
     Download Transcript
  ====================== */
  const downloadTranscript = () => {
    if (!fullTranscript) {
      alert("No transcript data available yet. Turn on captions and start speaking!");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([`Session ${id} Transcript\n\n${fullTranscript}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Transcript_Session_${id}.txt`;
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
    document.body.removeChild(element);
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative z-20">
        <div className="font-bold text-xl">
          Live Session <span className="text-gray-400 text-sm ml-2">ID: {id}</span>
        </div>
        
        <div className="flex gap-3">
          {/* Transcript Download Button */}
          {fullTranscript && (
            <button 
              onClick={downloadTranscript} 
              className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-white rounded text-sm font-medium transition-colors shadow-sm"
            >
              📝 Save Transcript
            </button>
          )}
        {/* Add this inside the flex gap-3 div in the navbar */}
          <button 
            onClick={toggleCaptions} 
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isCapturing ? "bg-red-600 hover:bg-red-500 animate-pulse" : "bg-yellow-600 hover:bg-yellow-500"
            }`}
          >
            {isCapturing ? "🔴 Stop Mic (Captions ON)" : "🎙️ Enable Captions"}
          </button>
          <button onClick={copyId} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
            Copy ID
          </button>
          <button onClick={copyLink} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors">
            Copy Link
          </button>
          <button onClick={() => { setShowShare(!showShare); setShowQR(false); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors">
            Share...
          </button>
          <button onClick={() => { setShowQR(!showQR); setShowShare(false); }} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors">
            {showQR ? "Hide QR" : "Show QR"}
          </button>
        </div>

        {/* Share Dropdown */}
        {showShare && (
          <div className="absolute top-16 right-32 bg-white text-gray-800 p-2 rounded shadow-xl border z-50 flex flex-col min-w-[150px]">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-green-600">WhatsApp</a>
            <a href={mailLink} className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-red-500">Email</a>
            <div className="border-t my-1"></div>
            <button onClick={handleNativeShare} className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-left text-blue-600">More Options...</button>
          </div>
        )}

        {/* QR Code Dropdown */}
        {showQR && (
          <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-xl border z-50 flex flex-col items-center">
            <p className="text-gray-800 text-sm font-bold mb-2">Scan to Join</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} alt="Join QR Code" className="w-32 h-32" />
          </div>
        )}
      </nav>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT → SLIDES */}
        <div className="w-1/2 border-r bg-gray-200 p-6 flex flex-col items-center justify-center overflow-y-auto relative">
          
          {pptFile ? (
            <div className="flex flex-col items-center w-full mt-8">
              
              {/* Delete Button (Top Right of the slide area) */}
              <button
                onClick={deletePPT}
                className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded shadow transition z-20"
              >
                Delete Presentation
              </button>

              {/* Slide container */}
              <div
                ref={slideRef}
                className="relative w-full max-w-5xl aspect-video bg-[#323639] rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-900/10"
              >
                {/* 👇 ADD THIS CSS FOR FLOATING EMOJIS 👇 */}
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
                <div className="absolute inset-0 z-10 cursor-default" />
                <iframe
                  key={pageNumber}
                  src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="slides"
                />

                {/* 👇 ADD CAPTION OVERLAY HERE 👇 */}
                {captionText && (
                  <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none">
                    <div className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg text-lg max-w-3xl text-center shadow-lg backdrop-blur-sm">
                      {captionText}
                    </div>
                  </div>
                )}

                {/* 👇 ADD THIS TO RENDER THE EMOJIS ON SCREEN 👇 */}
                {reactions.map((r) => (
                  <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
                    {r.emoji}
                  </div>
                ))}

                
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-6 bg-white p-3 rounded-full shadow-md">
                <button
                  onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
                >
                  Prev
                </button>

                <span className="font-semibold text-gray-700 min-w-[80px] text-center">
                  Slide {pageNumber}
                </span>

                <button
                  onClick={() => setPageNumber((p) => p + 1)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
                >
                  Next
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2"></div>

                <button
                  onClick={() => slideRef.current?.requestFullscreen()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
                >
                  Fullscreen
                </button>
              </div>
            </div>
          ) : (
            // Only show the upload prompt if there is NO file
            <div className="flex flex-col items-center justify-center text-gray-500 w-full">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="text-lg mb-4">Upload a PDF to start presenting</p>
              <input
                type="file"
                accept=".pdf"
                onChange={uploadPPT}
                className="block w-full max-w-sm text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 file:shadow-sm hover:file:bg-blue-50 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* RIGHT → QUESTIONS */}
        <div className="w-1/2 p-6 bg-white overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Questions</h2>

          {questions.length === 0 ? (
            <p className="text-gray-500 italic">No questions yet. Share the link to get started!</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                  <p className="font-semibold text-gray-800">Q: {q.question}</p>
                  {q.answer && (
                    <p className="text-blue-700 mt-2 bg-blue-50 p-2 rounded">
                      <span className="font-bold">AI:</span> {q.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}