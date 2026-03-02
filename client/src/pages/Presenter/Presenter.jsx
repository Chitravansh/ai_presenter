// // import { useParams } from "react-router-dom";
// // import { useEffect, useState, useRef } from "react"; // ✅ added useRef
// // import api from "../../services/api";
// // import socket from "../../services/socket";

// // const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000

// // export default function Presenter() {
// //   const { id } = useParams();

// //   const [questions, setQuestions] = useState([]);
// //   const [pptFile, setPptFile] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);

// //   const slideRef = useRef(null); // ✅ REQUIRED for fullscreen



// //   /* ======================
// //      Fetch old questions
// //   ====================== */

// //   const fetchQuestions = async () => {
// //     const res = await api.get(`/questions/${id}`);

// //     const formatted = res.data.map((q) => ({
// //       question: q.text,
// //       answer: null,
// //     }));

// //     setQuestions(formatted);
// //   };



// //   /* ======================
// //      Upload slides
// //   ====================== */

// //   const uploadPPT = async (e) => {
// //     const file = e.target.files[0];

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     const res = await api.post(`/upload/${id}`, formData);

// //     setPptFile(res.data.file);
// //     setPageNumber(1); // reset to first slide
// //     alert("Slides uploaded!");
// //   };



// //   /* ======================
// //      Socket realtime
// //   ====================== */

// //   useEffect(() => {
    
// //     fetchQuestions();

// //     socket.emit("join-session", id);

// //     const handler = (data) => {
// //       setQuestions((prev) => [...prev, data]);
// //     };

// //     socket.on("receive-question", handler);

// //     return () => socket.off("receive-question", handler);
// //   }, [id]);

// //   /* ======================
// //    Keyboard navigation
// // ====================== */

// // useEffect(() => {
// //   const handleKey = (e) => {
// //     if (!pptFile) return; // only after slides loaded

// //     if (e.key === "ArrowRight") {
// //       e.preventDefault();
// //       setPageNumber(p => p + 1);
// //     }

// //     if (e.key === "ArrowLeft") {
// //       e.preventDefault();
// //       setPageNumber(p => Math.max(p - 1, 1));
// //     }
// //   };

// //   window.addEventListener("keydown", handleKey);

// //   return () => window.removeEventListener("keydown", handleKey);
// // }, [pptFile]);




// //   /* ======================
// //      UI
// //   ====================== */

// //   return (
// //     <div className="h-screen flex">

// //       {/* LEFT → SLIDES */}
// //       <div className="w-1/2 border-r bg-gray-50 p-3 flex flex-col items-center">

// //         <input
// //           type="file"
// //           accept=".pdf"
// //           onChange={uploadPPT}
// //           className="mb-3"
// //         />

// //         {pptFile && (
// //           <>
// //             {/* Slide container */}
// //             <div
// //               ref={slideRef} // ✅ fullscreen target
// //               className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow"
// //             >
// //               <iframe
// //                 key={pageNumber}
// //                 src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`}
// //                 className="w-full h-full"
// //                 title="slides"
// //               />
// //             </div>

// //             {/* Controls */}
// //             <div className="flex gap-3 mt-4">

// //               <button
// //                 onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
// //                 className="px-3 py-1 bg-gray-200 rounded"
// //               >
// //                 Prev
// //               </button>

// //               <span className="font-semibold">
// //                 Slide {pageNumber}
// //               </span>

// //               <button
// //                 onClick={() => setPageNumber(p => p + 1)}
// //                 className="px-3 py-1 bg-gray-200 rounded"
// //               >
// //                 Next
// //               </button>

// //               <button
// //                 onClick={() => slideRef.current?.requestFullscreen()} // ✅ works now
// //                 className="px-3 py-1 bg-blue-600 text-white rounded"
// //               >
// //                 Fullscreen
// //               </button>

// //             </div>
// //           </>
// //         )}
// //       </div>



// //       {/* RIGHT → QUESTIONS */}
// //       <div className="w-1/2 p-4 overflow-y-auto">
// //         <h2 className="font-bold mb-4">Live Questions</h2>

// //         {questions.map((q, i) => (
// //           <div key={i} className="border p-3 my-2 rounded bg-white">
// //             <p className="font-semibold">Q: {q.question}</p>

// //             {q.answer && (
// //               <p className="text-blue-600 mt-1">AI: {q.answer}</p>
// //             )}
// //           </div>
// //         ))}
// //       </div>

// //     </div>
// //   );
// // }


// // import { useParams } from "react-router-dom";
// // import { useEffect, useState, useRef } from "react";
// // import api from "../../services/api";
// // import socket from "../../services/socket";

// // const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

// // export default function Presenter() {
// //   const { id } = useParams();

// //   const [questions, setQuestions] = useState([]);
// //   const [pptFile, setPptFile] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);
  
// //   // UI toggle states
// //   const [showQR, setShowQR] = useState(false);
// //   const [showShare, setShowShare] = useState(false);

// //   const slideRef = useRef(null);

// //   // Generate the link attendees will use to join
// //   const joinLink = `${window.location.origin}/join/${id}`;

// //   /* ======================
// //      Sharing Functions
// //   ====================== */
// //   const copyLink = () => {
// //     navigator.clipboard.writeText(joinLink);
// //     alert("Session Link copied to clipboard!");
// //   };

// //   const copyId = () => {
// //     navigator.clipboard.writeText(id);
// //     alert("Session ID copied to clipboard!");
// //   };

// //   const handleNativeShare = async () => {
// //     if (navigator.share) {
// //       try {
// //         await navigator.share({
// //           title: "Join my Live Session",
// //           text: `Join my live presentation session using this link!`,
// //           url: joinLink,
// //         });
// //       } catch (error) {
// //         console.log("Error sharing natively:", error);
// //       }
// //     } else {
// //       alert("Native sharing is not supported on this browser. Please use the copy links.");
// //     }
// //   };

// //   // Pre-formatted links for explicit platforms
// //   const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent("Join my live session here: " + joinLink)}`;
// //   const mailLink = `mailto:?subject=${encodeURIComponent("Join my Live Session")}&body=${encodeURIComponent("Click the link below to join my live presentation:\n\n" + joinLink)}`;

// //   /* ======================
// //      Fetch old questions
// //   ====================== */
// //   const fetchQuestions = async () => {
// //     try {
// //       const res = await api.get(`/questions/${id}`);
// //       const formatted = res.data.map((q) => ({
// //         question: q.text,
// //         answer: null,
// //       }));
// //       setQuestions(formatted);
// //     } catch (error) {
// //       console.error("Failed to fetch questions", error);
// //     }
// //   };

// //   /* ======================
// //      Upload slides
// //   ====================== */
// //   const uploadPPT = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await api.post(`/upload/${id}`, formData);
// //       setPptFile(res.data.file);
// //       setPageNumber(1);
// //       alert("Slides uploaded!");
// //     } catch (error) {
// //       console.error("Failed to upload slides", error);
// //       alert("Error uploading slides.");
// //     }
// //   };

// //   /* ======================
// //      Socket realtime
// //   ====================== */
// //   useEffect(() => {
// //     fetchQuestions();

// //     socket.emit("join-session", id);

// //     const handler = (data) => {
// //       setQuestions((prev) => [...prev, data]);
// //     };

// //     socket.on("receive-question", handler);

// //     return () => socket.off("receive-question", handler);
// //   }, [id]);

// //   /* ======================
// //      Keyboard navigation
// //   ====================== */
// //   useEffect(() => {
// //     const handleKey = (e) => {
// //       if (!pptFile) return;

// //       if (e.key === "ArrowRight") {
// //         e.preventDefault();
// //         setPageNumber((p) => p + 1);
// //       }

// //       if (e.key === "ArrowLeft") {
// //         e.preventDefault();
// //         setPageNumber((p) => Math.max(p - 1, 1));
// //       }
// //     };

// //     window.addEventListener("keydown", handleKey);
// //     return () => window.removeEventListener("keydown", handleKey);
// //   }, [pptFile]);

// //   /* ======================
// //      UI
// //   ====================== */
// //   return (
// //     <div className="h-screen flex flex-col bg-gray-100">
      
// //       {/* NAVIGATION BAR */}
// //       <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative">
// //         <div className="font-bold text-xl">
// //           Live Session <span className="text-gray-400 text-sm ml-2">ID: {id}</span>
// //         </div>
        
// //         <div className="flex gap-3">
// //           <button 
// //             onClick={copyId} 
// //             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
// //           >
// //             Copy ID
// //           </button>
          
// //           <button 
// //             onClick={copyLink} 
// //             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
// //           >
// //             Copy Link
// //           </button>

// //           {/* Share Button Toggle */}
// //           <button 
// //             onClick={() => { setShowShare(!showShare); setShowQR(false); }} 
// //             className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors"
// //           >
// //             Share...
// //           </button>
          
// //           {/* QR Button Toggle */}
// //           <button 
// //             onClick={() => { setShowQR(!showQR); setShowShare(false); }} 
// //             className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors"
// //           >
// //             {showQR ? "Hide QR" : "Show QR"}
// //           </button>
// //         </div>

// //         {/* Share Dropdown */}
// //         {showShare && (
// //           <div className="absolute top-16 right-32 bg-white text-gray-800 p-2 rounded shadow-xl border z-50 flex flex-col min-w-[150px]">
// //             <a 
// //               href={whatsappLink} 
// //               target="_blank" 
// //               rel="noopener noreferrer"
// //               className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-green-600"
// //             >
// //               WhatsApp
// //             </a>
// //             <a 
// //               href={mailLink} 
// //               className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-red-500"
// //             >
// //               Email
// //             </a>
// //             <div className="border-t my-1"></div>
// //             <button 
// //               onClick={handleNativeShare}
// //               className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-left text-blue-600"
// //             >
// //               More Options...
// //             </button>
// //           </div>
// //         )}

// //         {/* QR Code Dropdown */}
// //         {showQR && (
// //           <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-xl border z-50 flex flex-col items-center">
// //             <p className="text-gray-800 text-sm font-bold mb-2">Scan to Join</p>
// //             <img 
// //               src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} 
// //               alt="Join QR Code" 
// //               className="w-32 h-32"
// //             />
// //           </div>
// //         )}
// //       </nav>

// //       {/* MAIN CONTENT SPLIT */}
// //       <div className="flex flex-1 overflow-hidden">
        
// //         {/* LEFT → SLIDES */}
// //         <div className="w-1/2 border-r bg-gray-50 p-4 flex flex-col items-center overflow-y-auto">
// //           <input
// //             type="file"
// //             accept=".pdf"
// //             onChange={uploadPPT}
// //             className="mb-4 block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
// //           />

// //           {pptFile ? (
// //             <>
// //               {/* Slide container */}
// //               <div
// //                 ref={slideRef}
// //                 className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow-lg"
// //               >
// //                 <iframe
// //                   key={pageNumber}
// //                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`}
// //                   className="w-full h-full border-none"
// //                   title="slides"
// //                 />
// //               </div>

// //               {/* Controls */}
// //               <div className="flex items-center gap-4 mt-6">
// //                 <button
// //                   onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
// //                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition"
// //                 >
// //                   Prev
// //                 </button>

// //                 <span className="font-semibold text-lg">
// //                   Slide {pageNumber}
// //                 </span>

// //                 <button
// //                   onClick={() => setPageNumber((p) => p + 1)}
// //                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition"
// //                 >
// //                   Next
// //                 </button>

// //                 <button
// //                   onClick={() => slideRef.current?.requestFullscreen()}
// //                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition ml-4"
// //                 >
// //                   Fullscreen
// //                 </button>
// //               </div>
// //             </>
// //           ) : (
// //             <div className="flex-1 flex items-center justify-center text-gray-400">
// //               Upload a PDF to start presenting
// //             </div>
// //           )}
// //         </div>

// //         {/* RIGHT → QUESTIONS */}
// //         <div className="w-1/2 p-6 bg-white overflow-y-auto">
// //           <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Questions</h2>

// //           {questions.length === 0 ? (
// //             <p className="text-gray-500 italic">No questions yet. Share the link to get started!</p>
// //           ) : (
// //             <div className="space-y-4">
// //               {questions.map((q, i) => (
// //                 <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
// //                   <p className="font-semibold text-gray-800">Q: {q.question}</p>
// //                   {q.answer && (
// //                     <p className="text-blue-700 mt-2 bg-blue-50 p-2 rounded">
// //                       <span className="font-bold">AI:</span> {q.answer}
// //                     </p>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // import { useParams } from "react-router-dom";
// // import { useEffect, useState, useRef } from "react";
// // import api from "../../services/api";
// // import socket from "../../services/socket";

// // const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

// // export default function Presenter() {
// //   const { id } = useParams();

// //   const [questions, setQuestions] = useState([]);
// //   const [pptFile, setPptFile] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);
  
// //   const [showQR, setShowQR] = useState(false);
// //   const [showShare, setShowShare] = useState(false);

// //   const slideRef = useRef(null);

// //   const joinLink = `${window.location.origin}/join/${id}`;

// //   /* ======================
// //      Sharing Functions
// //   ====================== */
// //   const copyLink = () => {
// //     navigator.clipboard.writeText(joinLink);
// //     alert("Session Link copied to clipboard!");
// //   };

// //   const copyId = () => {
// //     navigator.clipboard.writeText(id);
// //     alert("Session ID copied to clipboard!");
// //   };

// //   const handleNativeShare = async () => {
// //     if (navigator.share) {
// //       try {
// //         await navigator.share({
// //           title: "Join my Live Session",
// //           text: `Join my live presentation session using this link!`,
// //           url: joinLink,
// //         });
// //       } catch (error) {
// //         console.log("Error sharing natively:", error);
// //       }
// //     } else {
// //       alert("Native sharing is not supported on this browser.");
// //     }
// //   };

// //   const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent("Join my live session here: " + joinLink)}`;
// //   const mailLink = `mailto:?subject=${encodeURIComponent("Join my Live Session")}&body=${encodeURIComponent("Click the link below to join my live presentation:\n\n" + joinLink)}`;

// //   /* ======================
// //      Fetch old questions
// //   ====================== */
// //   const fetchQuestions = async () => {
// //     try {
// //       const res = await api.get(`/questions/${id}`);
// //       const formatted = res.data.map((q) => ({
// //         question: q.text,
// //         answer: null,
// //       }));
// //       setQuestions(formatted);
// //     } catch (error) {
// //       console.error("Failed to fetch questions", error);
// //     }
// //   };

// //   /* ======================
// //      Upload slides
// //   ====================== */
// //   const uploadPPT = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await api.post(`/upload/${id}`, formData);
// //       setPptFile(res.data.file);
// //       setPageNumber(1);
// //       alert("Slides uploaded!");
// //     } catch (error) {
// //       console.error("Failed to upload slides", error);
// //       alert("Error uploading slides.");
// //     }
// //   };

// //   /* ======================
// //      Socket realtime
// //   ====================== */
// //   useEffect(() => {
// //     fetchQuestions();
// //     socket.emit("join-session", id);

// //     const handler = (data) => {
// //       setQuestions((prev) => [...prev, data]);
// //     };

// //     socket.on("receive-question", handler);
// //     return () => socket.off("receive-question", handler);
// //   }, [id]);

// //   /* ======================
// //      Keyboard navigation
// //   ====================== */
// //   useEffect(() => {
// //     const handleKey = (e) => {
// //       if (!pptFile) return;

// //       if (e.key === "ArrowRight") {
// //         e.preventDefault();
// //         setPageNumber((p) => p + 1);
// //       }

// //       if (e.key === "ArrowLeft") {
// //         e.preventDefault();
// //         setPageNumber((p) => Math.max(p - 1, 1));
// //       }
// //     };

// //     window.addEventListener("keydown", handleKey);
// //     return () => window.removeEventListener("keydown", handleKey);
// //   }, [pptFile]);

// //   /* ======================
// //      UI
// //   ====================== */
// //   return (
// //     <div className="h-screen flex flex-col bg-gray-100">
      
// //       {/* NAVIGATION BAR */}
// //       <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative z-20">
// //         <div className="font-bold text-xl">
// //           Live Session <span className="text-gray-400 text-sm ml-2">ID: {id}</span>
// //         </div>
        
// //         <div className="flex gap-3">
// //           <button onClick={copyId} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
// //             Copy ID
// //           </button>
// //           <button onClick={copyLink} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors">
// //             Copy Link
// //           </button>
// //           <button onClick={() => { setShowShare(!showShare); setShowQR(false); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors">
// //             Share...
// //           </button>
// //           <button onClick={() => { setShowQR(!showQR); setShowShare(false); }} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors">
// //             {showQR ? "Hide QR" : "Show QR"}
// //           </button>
// //         </div>

// //         {/* Share Dropdown */}
// //         {showShare && (
// //           <div className="absolute top-16 right-32 bg-white text-gray-800 p-2 rounded shadow-xl border z-50 flex flex-col min-w-[150px]">
// //             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-green-600">WhatsApp</a>
// //             <a href={mailLink} className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-red-500">Email</a>
// //             <div className="border-t my-1"></div>
// //             <button onClick={handleNativeShare} className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium text-left text-blue-600">More Options...</button>
// //           </div>
// //         )}

// //         {/* QR Code Dropdown */}
// //         {showQR && (
// //           <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-xl border z-50 flex flex-col items-center">
// //             <p className="text-gray-800 text-sm font-bold mb-2">Scan to Join</p>
// //             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} alt="Join QR Code" className="w-32 h-32" />
// //           </div>
// //         )}
// //       </nav>

// //       {/* MAIN CONTENT SPLIT */}
// //       <div className="flex flex-1 overflow-hidden">
        
// //         {/* LEFT → SLIDES */}
// //         <div className="w-1/2 border-r bg-gray-200 p-6 flex flex-col items-center justify-center overflow-y-auto relative">
          
// //           {/* File Upload stays absolute at the top so it doesn't shift the presentation */}
// //           <div className="absolute top-4 w-full flex justify-center z-10">
// //             <input
// //               type="file"
// //               accept=".pdf"
// //               onChange={uploadPPT}
// //               className="block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 file:shadow-sm hover:file:bg-blue-50"
// //             />
// //           </div>

// //           {pptFile ? (
// //             <div className="flex flex-col items-center w-full mt-12">
// //               {/* Slide container - Strict 16:9 Aspect Ratio with overlay */}
// //               <div
// //                 ref={slideRef}
// //                 className="relative w-full max-w-5xl aspect-video bg-[#323639] rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-900/10"
// //               >
// //                 {/* INVISIBLE OVERLAY: 
// //                   This invisible div sits over the iframe. It prevents the user from clicking 
// //                   or scrolling inside the native PDF viewer, forcing a static "slide" view.
// //                 */}
// //                 <div className="absolute inset-0 z-10 cursor-default" />

// //                 <iframe
// //                   key={pageNumber} // Re-renders cleanly on page change
// //                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
// //                   className="absolute inset-0 w-full h-full border-none"
// //                   title="slides"
// //                 />
// //               </div>

// //               {/* Controls */}
// //               <div className="flex items-center gap-4 mt-6 bg-white p-3 rounded-full shadow-md">
// //                 <button
// //                   onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
// //                   className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
// //                 >
// //                   Prev
// //                 </button>

// //                 <span className="font-semibold text-gray-700 min-w-[80px] text-center">
// //                   Slide {pageNumber}
// //                 </span>

// //                 <button
// //                   onClick={() => setPageNumber((p) => p + 1)}
// //                   className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
// //                 >
// //                   Next
// //                 </button>

// //                 <div className="w-px h-6 bg-gray-300 mx-2"></div>

// //                 <button
// //                   onClick={() => slideRef.current?.requestFullscreen()}
// //                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
// //                 >
// //                   Fullscreen
// //                 </button>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="flex flex-col items-center justify-center text-gray-500">
// //               <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
// //               <p className="text-lg">Upload a PDF to start presenting</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* RIGHT → QUESTIONS */}
// //         <div className="w-1/2 p-6 bg-white overflow-y-auto">
// //           <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Questions</h2>

// //           {questions.length === 0 ? (
// //             <p className="text-gray-500 italic">No questions yet. Share the link to get started!</p>
// //           ) : (
// //             <div className="space-y-4">
// //               {questions.map((q, i) => (
// //                 <div key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
// //                   <p className="font-semibold text-gray-800">Q: {q.question}</p>
// //                   {q.answer && (
// //                     <p className="text-blue-700 mt-2 bg-blue-50 p-2 rounded">
// //                       <span className="font-bold">AI:</span> {q.answer}
// //                     </p>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

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

//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captionText, setCaptionText] = useState("");

//   const [reactions, setReactions] = useState([]);

//   // Add this state at the top of Presenter.jsx
//   const [recommendations, setRecommendations] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   const recognitionRef = useRef(null);

//   const slideRef = useRef(null);

//   // Add these right under your existing captionText state
//   const [fullTranscript, setFullTranscript] = useState("");
//   const fullTranscriptRef = useRef(""); // Keeps track of text inside the speech event

//   const joinLink = `${window.location.origin}/audience/${id}`;

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
//      Data Fetching & Deletion
//   ====================== */
//   // const fetchSessionData = async () => {
//   //   try {
//   //     // 1. Fetch Questions
//   //     const qRes = await api.get(`/questions/${id}`);
//   //     const formatted = qRes.data.map((q) => ({
//   //       question: q.text,
//   //       answer: null,
//   //     }));
//   //     setQuestions(formatted);

//   //     // 2. Fetch Session Info (to see if a file is already uploaded)
//   //     // *Make sure your backend has a route like GET /session/:id that returns the active file*
//   //     const sessionRes = await api.get(`/session/${id}`);
//   //     if (sessionRes.data && sessionRes.data.pptFile) {
//   //       setPptFile(sessionRes.data.pptFile);
//   //     }
//   //   } catch (error) {
//   //     console.error("Failed to fetch session data", error);
//   //   }
//   // };

//   /* ======================
//      Data Fetching & Deletion
//   ====================== */
//   const fetchSessionData = async () => {
    
//     // 1. Fetch Questions (Independent Block)
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
//       console.log("No questions found yet or error fetching questions.");
//       // It's okay if this fails, we just keep going!
//     }

//     // 2. Fetch Active Presentation File (Independent Block)
//     try {
//       console.log("Asking server for active presentation...");
//       const sessionRes = await api.get(`/upload/${id}`);
      
//       console.log("Server responded with:", sessionRes.data);
      
//       if (sessionRes.data && sessionRes.data.pptFile) {
//         setPptFile(sessionRes.data.pptFile);
//       }
//     } catch (error) {
//       console.error("Failed to fetch session data", error);
//     }
//   };

//   const uploadPPT = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await api.post(`/upload/${id}`, formData);
//       setPptFile(res.data.file);
//       setPageNumber(1);
//     } catch (error) {
//       console.error("Failed to upload slides", error);
//       alert("Error uploading slides.");
//     }
//   };

//   const deletePPT = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this presentation?");
//     if (!confirmDelete) return;

//     try {
//       // *Make sure your backend has a route like DELETE /upload/:id*
//       await api.delete(`/upload/${id}`);
//       setPptFile(null);
//       setPageNumber(1);
//     } catch (error) {
//       console.error("Failed to delete slides", error);
//       alert("Error deleting presentation.");
//     }
//   };

//   /* ======================
//      Socket realtime
//   ====================== */
//   useEffect(() => {
//     fetchSessionData();
//     socket.emit("join-session", id);

//     const handleRecommendations = (data) => {
//     setRecommendations(data);
//     setIsGenerating(false);
//   };

//     const handler = (data) => {
//       setQuestions((prev) => [...prev, data]);
//     };

//     const handleReaction = (emoji) => {
//       const reactionId = Date.now() + Math.random();
//       const leftPosition = Math.random() * 80 + 10; 
      
//       setReactions((prev) => [...prev, { id: reactionId, emoji, left: leftPosition }]);
      
//       // Remove emoji after 2 seconds
//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== reactionId));
//       }, 2000);
//     };

//     socket.on("receive-question", handler);
//     socket.on("receive-reaction", handleReaction);
//     socket.on("receive-recommendations", handleRecommendations);
//     return () =>{ socket.off("receive-question", handler);
//                  socket.off("receive-reaction", handleReaction);
//                  socket.off("receive-recommendations", handleRecommendations);
//     }
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
//      Broadcast Slide Changes
//   ====================== */
//   useEffect(() => {
//     // Whenever the pageNumber changes, tell the server!
//     socket.emit("change-slide", { sessionId: id, pageNumber });
//   }, [pageNumber, id]);

//   /* ======================
//      Speech Recognition (Live Captions)
//   ====================== */
//   useEffect(() => {
//     // Check if browser supports SpeechRecognition (Chrome/Edge/Safari)
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true; // Keep listening
//       recognitionRef.current.interimResults = true; // Show words as they are spoken

//       // recognitionRef.current.onresult = (event) => {
//       //   let currentTranscript = "";
//       //   for (let i = event.resultIndex; i < event.results.length; i++) {
//       //     currentTranscript += event.results[i][0].transcript;
//       //   }
        
//       //   // Show on presenter's screen
//       //   setCaptionText(currentTranscript);
//       //   // Send to audience
//       //   socket.emit("send-caption", { sessionId: id, text: currentTranscript });
//       // };

//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = "";
//         let finalTranscriptSegment = "";

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const textLine = event.results[i][0].transcript;
          
//           if (event.results[i].isFinal) {
//             // If the browser is absolutely sure of the sentence, lock it in!
//             finalTranscriptSegment += textLine + " ";
//             fullTranscriptRef.current += textLine + " "; 
//             setFullTranscript(fullTranscriptRef.current);
//           } else {
//             // If the browser is still guessing, keep it as interim
//             interimTranscript += textLine;
//           }
//         }
        
//         // What we show on screen: Interim (live guessing) OR the last final sentence
//         const displayCaption = interimTranscript || finalTranscriptSegment;
        
//         if (displayCaption) {
//           setCaptionText(displayCaption);
//           // 👇 Add fullTranscript to the data being sent
//           socket.emit("send-caption", { sessionId: id, 
//             text: displayCaption, 
//             fullTranscript: fullTranscriptRef.current 
//           });
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//         if (event.error === 'not-allowed') {
//           setIsCapturing(false);
//           alert("Microphone access was denied.");
//         }
//       };
//     } else {
//       console.warn("Speech Recognition API is not supported in this browser.");
//     }

//     // Cleanup on unmount
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [id]);

//   const toggleCaptions = () => {
//     if (!recognitionRef.current) {
//       alert("Your browser does not support live captioning. Try Google Chrome.");
//       return;
//     }

//     if (isCapturing) {
//       recognitionRef.current.stop();
//       setIsCapturing(false);
//       setCaptionText("");
//       socket.emit("send-caption", { sessionId: id, text: "" }); // Clear audience screen
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsCapturing(true);
//       } catch (e) {
//         console.error("Failed to start speech recognition:", e);
//       }
//     }
//   };

//   /* ======================
//      Download Transcript
//   ====================== */
//   const downloadTranscript = () => {
//     if (!fullTranscript) {
//       alert("No transcript data available yet. Turn on captions and start speaking!");
//       return;
//     }

//     const element = document.createElement("a");
//     const file = new Blob([`Session ${id} Transcript\n\n${fullTranscript}`], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `Transcript_Session_${id}.txt`;
//     document.body.appendChild(element); // Required for this to work in Firefox
//     element.click();
//     document.body.removeChild(element);
//   };

//   const generateRecommendations = () => {
//     if (!fullTranscript) {
//       alert("Turn on captions and speak first so the AI knows what your topic is!");
//       return;
//     }
//     setIsGenerating(true);
//     // Send the last 500 characters of speech to the AI for context
//     const context = fullTranscript.slice(-500); 
//     socket.emit("get-recommendations", { sessionId: id, currentText: context });
//   };


//   /**===================================
//    * Function to make the link clickable
//    * ===================================
//    */
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
//       <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative z-20">
//         <div className="font-bold text-xl">
//           Live Session <span className="text-gray-400 text-sm ml-2">ID: {id}</span>
//         </div>
        
//         <div className="flex gap-3">
//           {/* Transcript Download Button */}
//           {fullTranscript && (
//             <button 
//               onClick={downloadTranscript} 
//               className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-white rounded text-sm font-medium transition-colors shadow-sm"
//             >
//               📝 Save Transcript
//             </button>
//           )}
//         {/* Add this inside the flex gap-3 div in the navbar */}
//           <button 
//             onClick={toggleCaptions} 
//             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
//               isCapturing ? "bg-red-600 hover:bg-red-500 animate-pulse" : "bg-yellow-600 hover:bg-yellow-500"
//             }`}
//           >
//             {isCapturing ? "🔴 Stop Mic (Captions ON)" : "🎙️ Enable Captions"}
//           </button>
//           <button onClick={copyId} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
//             Copy ID
//           </button>
//           <button onClick={copyLink} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors">
//             Copy Link
//           </button>

//           {/* 👇 NEW: End Session & View Analytics Button 👇 */}
//           <button 
//             onClick={() => window.location.href = `/analytics/${id}`} 
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition-colors shadow-sm ml-4"
//           >
//             🛑 End Session & View Analytics
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
          
//           {pptFile ? (
//             <div className="flex flex-col items-center w-full mt-8">
              
//               {/* Delete Button (Top Right of the slide area) */}
//               <button
//                 onClick={deletePPT}
//                 className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded shadow transition z-20"
//               >
//                 Delete Presentation
//               </button>

//               {/* Slide container */}
//               <div
//                 ref={slideRef}
//                 className="relative w-full max-w-5xl aspect-video bg-[#323639] rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-900/10"
//               >
//                 {/* 👇 ADD THIS CSS FOR FLOATING EMOJIS 👇 */}
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
//                 <div className="absolute inset-0 z-10 cursor-default" />
//                 <iframe
//                   key={pageNumber}
//                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
//                   className="absolute inset-0 w-full h-full border-none"
//                   title="slides"
//                 />

//                 {/* 👇 ADD CAPTION OVERLAY HERE 👇 */}
//                 {captionText && (
//                   <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none">
//                     <div className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg text-lg max-w-3xl text-center shadow-lg backdrop-blur-sm">
//                       {captionText}
//                     </div>
//                   </div>
//                 )}

//                 {/* 👇 ADD THIS TO RENDER THE EMOJIS ON SCREEN 👇 */}
//                 {reactions.map((r) => (
//                   <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
//                     {r.emoji}
//                   </div>
//                 ))}

                
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
//             // Only show the upload prompt if there is NO file
//             <div className="flex flex-col items-center justify-center text-gray-500 w-full">
//               <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
//               <p className="text-lg mb-4">Upload a PDF to start presenting</p>
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={uploadPPT}
//                 className="block w-full max-w-sm text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 file:shadow-sm hover:file:bg-blue-50 cursor-pointer"
//               />
//             </div>
//           )}
//         </div>

//         {/* RIGHT → QUESTIONS */}
//         <div className="w-1/2 p-6 bg-white overflow-y-auto">

//         {/* 👇 NEW: Recommendation Engine Panel 👇 */}
//           <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-lg font-bold text-blue-900">🧠 AI Suggested Content</h2>
//               <button 
//                 onClick={generateRecommendations}
//                 disabled={isGenerating}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow transition disabled:opacity-50"
//               >
//                 {isGenerating ? "Generating..." : "💡 Auto-Suggest Links"}
//               </button>
//             </div>
            
//                {recommendations ? (
//               <div className="p-4 bg-white rounded border border-blue-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
//                 {/* 👇 The formatLinks function is now actively wrapping the URLs! 👇 */}
//                 {formatLinks(recommendations)}
//               </div>
//             ) : (
//               <p className="text-sm text-blue-600 italic">Click the button to generate related study materials based on your live speech.</p>
//             )}
//           </div>


        
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
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile responsiveness

//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captionText, setCaptionText] = useState("");

//   const [reactions, setReactions] = useState([]);

//   // Recommendation states
//   const [recommendations, setRecommendations] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   const recognitionRef = useRef(null);
//   const slideRef = useRef(null);

//   const [fullTranscript, setFullTranscript] = useState("");
//   const fullTranscriptRef = useRef(""); 

//   const joinLink = `${window.location.origin}/audience/${id}`;

//   /* ======================
//      Sharing Functions
//   ====================== */
//   const copyLink = () => {
//     navigator.clipboard.writeText(joinLink);
//     alert("Session Link copied to clipboard!");
//     setIsMobileMenuOpen(false);
//   };

//   const copyId = () => {
//     navigator.clipboard.writeText(id);
//     alert("Session ID copied to clipboard!");
//     setIsMobileMenuOpen(false);
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
//      Data Fetching & Deletion
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
//       console.log("No questions found yet.");
//     }

//     try {
//       const sessionRes = await api.get(`/upload/${id}`);
//       if (sessionRes.data && sessionRes.data.pptFile) {
//         setPptFile(sessionRes.data.pptFile);
//       }
//     } catch (error) {
//       console.error("Failed to fetch session data", error);
//     }
//   };

//   const uploadPPT = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await api.post(`/upload/${id}`, formData);
//       setPptFile(res.data.file);
//       setPageNumber(1);
//     } catch (error) {
//       console.error("Failed to upload slides", error);
//       alert("Error uploading slides.");
//     }
//   };

//   const deletePPT = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this presentation?");
//     if (!confirmDelete) return;

//     try {
//       await api.delete(`/upload/${id}`);
//       setPptFile(null);
//       setPageNumber(1);
//     } catch (error) {
//       console.error("Failed to delete slides", error);
//       alert("Error deleting presentation.");
//     }
//   };

//   /* ======================
//      Socket realtime
//   ====================== */
//   useEffect(() => {
//     fetchSessionData();
//     socket.emit("join-session", id);

//     const handleRecommendations = (data) => {
//       setRecommendations(data);
//       setIsGenerating(false);
//     };

//     const handler = (data) => {
//       setQuestions((prev) => [...prev, data]);
//     };

//     const handleReaction = (emoji) => {
//       const reactionId = Date.now() + Math.random();
//       const leftPosition = Math.random() * 80 + 10; 
      
//       setReactions((prev) => [...prev, { id: reactionId, emoji, left: leftPosition }]);
      
//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== reactionId));
//       }, 2000);
//     };

//     socket.on("receive-question", handler);
//     socket.on("receive-reaction", handleReaction);
//     socket.on("receive-recommendations", handleRecommendations);
    
//     return () => { 
//       socket.off("receive-question", handler);
//       socket.off("receive-reaction", handleReaction);
//       socket.off("receive-recommendations", handleRecommendations);
//     }
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

//   useEffect(() => {
//     socket.emit("change-slide", { sessionId: id, pageNumber });
//   }, [pageNumber, id]);

//   /* ======================
//      Speech Recognition
//   ====================== */
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true; 
//       recognitionRef.current.interimResults = true; 

//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = "";
//         let finalTranscriptSegment = "";

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const textLine = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscriptSegment += textLine + " ";
//             fullTranscriptRef.current += textLine + " "; 
//             setFullTranscript(fullTranscriptRef.current);
//           } else {
//             interimTranscript += textLine;
//           }
//         }
        
//         const displayCaption = interimTranscript || finalTranscriptSegment;
        
//         if (displayCaption) {
//           setCaptionText(displayCaption);
//           socket.emit("send-caption", { sessionId: id, 
//             text: displayCaption, 
//             fullTranscript: fullTranscriptRef.current 
//           });
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         if (event.error === 'not-allowed') {
//           setIsCapturing(false);
//           alert("Microphone access was denied.");
//         }
//       };
//     }

//     return () => {
//       if (recognitionRef.current) recognitionRef.current.stop();
//     };
//   }, [id]);

//   const toggleCaptions = () => {
//     if (!recognitionRef.current) {
//       alert("Your browser does not support live captioning. Try Google Chrome.");
//       return;
//     }
//     if (isCapturing) {
//       recognitionRef.current.stop();
//       setIsCapturing(false);
//       setCaptionText("");
//       socket.emit("send-caption", { sessionId: id, text: "" }); 
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsCapturing(true);
//       } catch (e) {
//         console.error("Failed to start speech recognition:", e);
//       }
//     }
//   };

//   const downloadTranscript = () => {
//     if (!fullTranscript) {
//       alert("No transcript data available yet. Turn on captions and start speaking!");
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

//   const generateRecommendations = () => {
//     if (!fullTranscript) {
//       alert("Turn on captions and speak first so the AI knows what your topic is!");
//       return;
//     }
//     setIsGenerating(true);
//     const context = fullTranscript.slice(-500); 
//     socket.emit("get-recommendations", { sessionId: id, currentText: context });
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
//             <span className="hidden sm:block text-2xl font-extrabold text-gray-900 tracking-tight">Present<span className="text-blue-600">Pro</span></span>
//             <span className="sm:hidden text-xl font-extrabold text-gray-900 ml-2">ID: {id.slice(-4)}</span>
//           </div>
          
//           {/* Desktop Controls */}
//           <div className="hidden lg:flex items-center gap-3">
//             <span className="text-gray-400 text-sm font-medium mr-2">Session ID: <span className="text-gray-800">{id}</span></span>
            
//             {fullTranscript && (
//               <button onClick={downloadTranscript} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm">
//                 📝 Transcript
//               </button>
//             )}
            
//             <button 
//               onClick={toggleCaptions} 
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
//                 isCapturing ? "bg-red-50 text-red-600 border border-red-200 animate-pulse" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               {isCapturing ? "🔴 Stop Mic" : "🎙️ Enable Captions"}
//             </button>

//             <div className="w-px h-6 bg-gray-200 mx-1"></div>

//             <button onClick={() => { setShowShare(!showShare); setShowQR(false); }} className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-medium transition-colors">
//               Share Link
//             </button>
//             <button onClick={() => { setShowQR(!showQR); setShowShare(false); }} className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-medium transition-colors">
//               Show QR
//             </button>

//             <button 
//               onClick={() => window.location.href = `/analytics/${id}`} 
//               className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all shadow-md ml-2"
//             >
//               End Session
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

//         {/* Desktop Share Dropdown */}
//         {showShare && (
//           <div className="hidden lg:flex absolute top-20 right-48 bg-white text-gray-800 p-2 rounded-xl shadow-xl border border-gray-100 z-50 flex-col min-w-[180px] animate-fade-in-up">
//             <button onClick={copyLink} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-left transition-colors">📋 Copy Link</button>
//             <button onClick={copyId} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-left transition-colors">#️⃣ Copy Session ID</button>
//             <div className="border-t border-gray-100 my-1"></div>
//             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-green-50 rounded-lg text-sm font-medium text-green-600 transition-colors">📱 WhatsApp</a>
//             <a href={mailLink} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 transition-colors">✉️ Email</a>
//           </div>
//         )}

//         {/* Desktop QR Dropdown */}
//         {showQR && (
//           <div className="hidden lg:flex absolute top-20 right-24 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-50 flex-col items-center animate-fade-in-up">
//             <p className="text-gray-800 text-sm font-bold mb-3">Scan to Join</p>
//             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} alt="QR Code" className="w-32 h-32 rounded-lg" />
//           </div>
//         )}

//         {/* Mobile Dropdown Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full left-0 top-20 flex flex-col py-4 px-6 space-y-3 animate-fade-in">
//             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Controls</div>
//             <button onClick={toggleCaptions} className={`w-full text-left px-4 py-3 rounded-xl font-medium ${isCapturing ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-700"}`}>
//               {isCapturing ? "🔴 Stop Microphone" : "🎙️ Enable Captions"}
//             </button>
//             {fullTranscript && (
//               <button onClick={downloadTranscript} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-gray-50 text-gray-700">📝 Download Transcript</button>
//             )}
//             <div className="border-t border-gray-100 my-2"></div>
//             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Share</div>
//             <button onClick={copyLink} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-blue-50 text-blue-700">📋 Copy Join Link</button>
//             <button onClick={() => window.location.href = `/analytics/${id}`} className="w-full text-center mt-4 px-4 py-3 rounded-xl font-bold bg-gray-900 text-white shadow-md">
//               🛑 End Session
//             </button>
//           </div>
//         )}
//       </header>

//       {/* MAIN CONTENT SPLIT */}
//       <div className="flex flex-col lg:flex-row flex-1 mt-20 h-[calc(100vh-5rem)] overflow-hidden">
        
//         {/* LEFT → SLIDES AREA */}
//         <div className="w-full lg:w-7/12 bg-[#FAFAFA] p-4 lg:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto lg:overflow-hidden h-[50vh] lg:h-full">
          
//           {pptFile ? (
//             <div className="flex flex-col items-center w-full max-w-5xl h-full justify-center">
              
//               <button
//                 onClick={deletePPT}
//                 className="absolute top-4 lg:top-8 right-4 lg:right-8 px-4 py-2 bg-white/80 hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 text-sm font-medium rounded-xl shadow-sm transition-all z-20 backdrop-blur-sm"
//               >
//                 Delete PDF
//               </button>

//               <div
//                 ref={slideRef}
//                 className="relative w-full aspect-video bg-[#323639] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10"
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
//                 <div className="absolute inset-0 z-10 cursor-default" />
//                 <iframe
//                   key={pageNumber}
//                   src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
//                   className="absolute inset-0 w-full h-full border-none"
//                   title="slides"
//                 />

//                 {captionText && (
//                   <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
//                     <div className="bg-gray-900/85 text-white px-6 py-3 rounded-2xl text-lg max-w-3xl text-center shadow-2xl backdrop-blur-md font-medium border border-white/10 tracking-wide">
//                       {captionText}
//                     </div>
//                   </div>
//                 )}

//                 {reactions.map((r) => (
//                   <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
//                     {r.emoji}
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center gap-3 lg:gap-4 mt-6 bg-white p-2 lg:p-3 rounded-2xl shadow-sm border border-gray-100">
//                 <button
//                   onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
//                   className="px-4 lg:px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors"
//                 >
//                   Prev
//                 </button>

//                 <span className="font-semibold text-gray-700 min-w-[70px] text-center text-sm lg:text-base">
//                   {pageNumber}
//                 </span>

//                 <button
//                   onClick={() => setPageNumber((p) => p + 1)}
//                   className="px-4 lg:px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors"
//                 >
//                   Next
//                 </button>

//                 <div className="w-px h-6 bg-gray-200 mx-1 lg:mx-2"></div>

//                 <button
//                   onClick={() => slideRef.current?.requestFullscreen()}
//                   className="hidden sm:block px-4 lg:px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors"
//                 >
//                   Fullscreen
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center w-full max-w-md animate-fade-in-up">
//               <label className="w-full flex flex-col items-center justify-center px-6 py-16 bg-white border-2 border-dashed border-blue-200 rounded-3xl shadow-sm hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all group">
//                 <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   <span className="text-4xl">📄</span>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Presentation</h3>
//                 <p className="text-gray-500 text-center text-sm mb-6 max-w-xs">Click here to browse your files. Only PDF format is supported for optimal viewing.</p>
//                 <div className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md group-hover:bg-blue-700 transition-colors">
//                   Select File
//                 </div>
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={uploadPPT}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           )}
//         </div>

//         {/* RIGHT → INTERACTION AREA */}
//         <div className="w-full lg:w-5/12 bg-white flex flex-col h-[50vh] lg:h-full overflow-hidden">
//           <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
            
//             {/* AI RECOMMENDATIONS PANEL */}
//             <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100/60 rounded-3xl p-6 shadow-sm group transition-all hover:shadow-md">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-10 -mt-10"></div>
              
//               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 relative z-10">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-lg">🧠</div>
//                   <h2 className="text-lg font-bold text-indigo-950">AI Assistant</h2>
//                 </div>
//                 <button 
//                   onClick={generateRecommendations}
//                   disabled={isGenerating}
//                   className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
//                 >
//                   {isGenerating ? "Analyzing..." : "💡 Suggest Links"}
//                 </button>
//               </div>
              
//               {recommendations ? (
//                 <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10 text-sm">
//                   {formatLinks(recommendations)}
//                 </div>
//               ) : (
//                 <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white border-dashed text-center relative z-10">
//                   <p className="text-sm text-indigo-600/80 font-medium">Turn on captions and speak to generate relevant study materials instantly.</p>
//                 </div>
//               )}
//             </div>

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
//                   <p className="text-sm text-gray-400 mt-1">Share the room link to let your audience ask questions.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-5 pb-8">
//                   {questions.map((q, i) => (
//                     <div key={i} className="flex flex-col gap-2 animate-fade-in-up">
//                       {/* User Question Bubble */}
//                       <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-[90%] relative shadow-sm">
//                         <span className="absolute -top-2.5 -left-2 text-xl bg-white rounded-full">🙋</span>
//                         <p className="font-semibold text-gray-800 text-sm leading-relaxed ml-2">{q.question}</p>
//                       </div>
                      
//                       {/* AI Answer Bubble */}
//                       {q.answer && (
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 p-4 rounded-2xl rounded-tr-sm self-end max-w-[90%] relative shadow-sm mt-1">
//                           <span className="absolute -top-2.5 -right-2 text-xl bg-white rounded-full shadow-sm p-0.5">🤖</span>
//                           <p className="text-blue-900 text-sm leading-relaxed mr-2 font-medium">{q.answer}</p>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

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

//const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000;

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Presenter() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [pptFile, setPptFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isCapturing, setIsCapturing] = useState(false);
  const [captionText, setCaptionText] = useState("");

  const [reactions, setReactions] = useState([]);

  // Recommendation states
  const [recommendations, setRecommendations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const recognitionRef = useRef(null);
  const slideRef = useRef(null);

  const [fullTranscript, setFullTranscript] = useState("");
  const fullTranscriptRef = useRef(""); 

  const joinLink = `${window.location.origin}/audience/${id}`;

  /* ======================
     Sharing Functions
  ====================== */
  const copyLink = () => {
    navigator.clipboard.writeText(joinLink);
    alert("Session Link copied to clipboard!");
    setIsMobileMenuOpen(false);
    setShowShare(false);
  };

  const copyId = () => {
    navigator.clipboard.writeText(id);
    alert("Session ID copied to clipboard!");
    setIsMobileMenuOpen(false);
    setShowShare(false);
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
      alert("Native sharing is not supported on this browser. Please use the copy link option.");
    }
    setShowShare(false);
  };

  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent("Join my live session here: " + joinLink)}`;
  const mailLink = `mailto:?subject=${encodeURIComponent("Join my Live Session")}&body=${encodeURIComponent("Click the link below to join my live presentation:\n\n" + joinLink)}`;

  /* ======================
     Data Fetching & Deletion
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
      console.log("No questions found yet.");
    }

    try {
      const sessionRes = await api.get(`/upload/${id}`);
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

    const handleRecommendations = (data) => {
      setRecommendations(data);
      setIsGenerating(false);
    };

    const handler = (data) => {
      setQuestions((prev) => [...prev, data]);
    };

    const handleReaction = (emoji) => {
      const reactionId = Date.now() + Math.random();
      const leftPosition = Math.random() * 80 + 10; 
      
      setReactions((prev) => [...prev, { id: reactionId, emoji, left: leftPosition }]);
      
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reactionId));
      }, 2000);
    };

    socket.on("receive-question", handler);
    socket.on("receive-reaction", handleReaction);
    socket.on("receive-recommendations", handleRecommendations);
    
    return () => { 
      socket.off("receive-question", handler);
      socket.off("receive-reaction", handleReaction);
      socket.off("receive-recommendations", handleRecommendations);
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

  useEffect(() => {
    socket.emit("change-slide", { sessionId: id, pageNumber });
  }, [pageNumber, id]);

  /* ======================
     Speech Recognition
  ====================== */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; 
      recognitionRef.current.interimResults = true; 

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscriptSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const textLine = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptSegment += textLine + " ";
            fullTranscriptRef.current += textLine + " "; 
            setFullTranscript(fullTranscriptRef.current);
          } else {
            interimTranscript += textLine;
          }
        }
        
        const displayCaption = interimTranscript || finalTranscriptSegment;
        
        if (displayCaption) {
          setCaptionText(displayCaption);
          socket.emit("send-caption", { sessionId: id, 
            text: displayCaption, 
            fullTranscript: fullTranscriptRef.current 
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setIsCapturing(false);
          alert("Microphone access was denied.");
        }
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
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
      socket.emit("send-caption", { sessionId: id, text: "" }); 
    } else {
      try {
        recognitionRef.current.start();
        setIsCapturing(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  const downloadTranscript = () => {
    if (!fullTranscript) {
      alert("No transcript data available yet. Turn on captions and start speaking!");
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

  const generateRecommendations = () => {
    if (!fullTranscript) {
      alert("Turn on captions and speak first so the AI knows what your topic is!");
      return;
    }
    setIsGenerating(true);
    const context = fullTranscript.slice(-500); 
    socket.emit("get-recommendations", { sessionId: id, currentText: context });
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
            <span className="hidden sm:block text-2xl font-extrabold text-gray-900 tracking-tight">Present<span className="text-blue-600">Pro</span></span>
            <span className="sm:hidden text-xl font-extrabold text-gray-900 ml-2">ID: {id.slice(-4)}</span>
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-gray-400 text-sm font-medium mr-2">Session ID: <span className="text-gray-800">{id}</span></span>
            
            {fullTranscript && (
              <button onClick={downloadTranscript} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm">
                📝 Transcript
              </button>
            )}
            
            <button 
              onClick={toggleCaptions} 
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
                isCapturing ? "bg-red-50 text-red-600 border border-red-200 animate-pulse" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isCapturing ? "🔴 Stop Mic" : "🎙️ Enable Captions"}
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <button onClick={() => { setShowShare(!showShare); setShowQR(false); }} className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-medium transition-colors">
              Share Link
            </button>
            <button onClick={() => { setShowQR(!showQR); setShowShare(false); }} className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-medium transition-colors">
              Show QR
            </button>

            <button 
              onClick={() => window.location.href = `/analytics/${id}`} 
              className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all shadow-md ml-2"
            >
              End Session
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

        {/* Desktop Share Dropdown */}
        {showShare && (
          <div className="hidden lg:flex absolute top-20 right-48 bg-white text-gray-800 p-2 rounded-xl shadow-xl border border-gray-100 z-50 flex-col min-w-[180px] animate-fade-in-up">
            <button onClick={copyLink} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-left transition-colors">📋 Copy Link</button>
            <button onClick={copyId} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-left transition-colors">#️⃣ Copy Session ID</button>
            <div className="border-t border-gray-100 my-1"></div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-green-50 rounded-lg text-sm font-medium text-green-600 transition-colors">📱 WhatsApp</a>
            <a href={mailLink} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 transition-colors">✉️ Email</a>
            {/* 👇 NEW: Other native share option 👇 */}
            <button onClick={handleNativeShare} className="px-4 py-2 hover:bg-purple-50 rounded-lg text-sm font-medium text-left text-purple-600 transition-colors">🌐 Other...</button>
          </div>
        )}

        {/* Desktop QR Dropdown */}
        {showQR && (
          <div className="hidden lg:flex absolute top-20 right-24 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-50 flex-col items-center animate-fade-in-up">
            <p className="text-gray-800 text-sm font-bold mb-3">Scan to Join</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`} alt="QR Code" className="w-32 h-32 rounded-lg" />
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full left-0 top-20 flex flex-col py-4 px-6 space-y-3 animate-fade-in">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Controls</div>
            <button onClick={toggleCaptions} className={`w-full text-left px-4 py-3 rounded-xl font-medium ${isCapturing ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-700"}`}>
              {isCapturing ? "🔴 Stop Microphone" : "🎙️ Enable Captions"}
            </button>
            {fullTranscript && (
              <button onClick={downloadTranscript} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-gray-50 text-gray-700">📝 Download Transcript</button>
            )}
            <div className="border-t border-gray-100 my-2"></div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Share</div>
            <button onClick={copyLink} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-blue-50 text-blue-700">📋 Copy Join Link</button>
            {/* 👇 NEW: Other native share option for mobile 👇 */}
            <button onClick={handleNativeShare} className="w-full text-left px-4 py-3 rounded-xl font-medium bg-purple-50 text-purple-700">🌐 Share via...</button>
            <button onClick={() => window.location.href = `/analytics/${id}`} className="w-full text-center mt-4 px-4 py-3 rounded-xl font-bold bg-gray-900 text-white shadow-md">
              🛑 End Session
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-col lg:flex-row flex-1 mt-20 h-[calc(100vh-5rem)] overflow-hidden">
        
        {/* LEFT → SLIDES AREA */}
        <div className="w-full lg:w-7/12 bg-[#FAFAFA] p-4 lg:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto lg:overflow-hidden h-[50vh] lg:h-full">
          
          {pptFile ? (
            <div className="flex flex-col items-center w-full max-w-5xl h-full justify-center">
              
              {/* 👇 FIXED: Top Control Bar (Moves Delete Button off the slide) 👇 */}
              <div className="w-full flex justify-between items-end mb-3 px-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Presentation</span>
                <button
                  onClick={deletePPT}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1.5 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                >
                  🗑️ Delete PDF
                </button>
              </div>

              <div
                ref={slideRef}
                className="relative w-full aspect-video bg-[#323639] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10"
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
                <div className="absolute inset-0 z-10 cursor-default" />
                {/* <iframe
                  key={pageNumber}
                  src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="slides"
                /> */}
                <iframe
                  key={pageNumber}
                  src={`${BASE_URL}/uploads/${pptFile}#page=${pageNumber}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="slides"
                />

                {captionText && (
                  <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
                    <div className="bg-gray-900/85 text-white px-6 py-3 rounded-2xl text-lg max-w-3xl text-center shadow-2xl backdrop-blur-md font-medium border border-white/10 tracking-wide">
                      {captionText}
                    </div>
                  </div>
                )}

                {reactions.map((r) => (
                  <div key={r.id} className="floating-emoji" style={{ left: `${r.left}%` }}>
                    {r.emoji}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 lg:gap-4 mt-6 bg-white p-2 lg:p-3 rounded-2xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                  className="px-4 lg:px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Prev
                </button>

                <span className="font-semibold text-gray-700 min-w-[70px] text-center text-sm lg:text-base">
                  {pageNumber}
                </span>

                <button
                  onClick={() => setPageNumber((p) => p + 1)}
                  className="px-4 lg:px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Next
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1 lg:mx-2"></div>

                <button
                  onClick={() => slideRef.current?.requestFullscreen()}
                  className="hidden sm:block px-4 lg:px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors"
                >
                  Fullscreen
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-md animate-fade-in-up">
              <label className="w-full flex flex-col items-center justify-center px-6 py-16 bg-white border-2 border-dashed border-blue-200 rounded-3xl shadow-sm hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all group">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📄</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Presentation</h3>
                <p className="text-gray-500 text-center text-sm mb-6 max-w-xs">Click here to browse your files. Only PDF format is supported for optimal viewing.</p>
                <div className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md group-hover:bg-blue-700 transition-colors">
                  Select File
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={uploadPPT}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* RIGHT → INTERACTION AREA */}
        <div className="w-full lg:w-5/12 bg-white flex flex-col h-[50vh] lg:h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
            
            {/* AI RECOMMENDATIONS PANEL */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100/60 rounded-3xl p-6 shadow-sm group transition-all hover:shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-10 -mt-10"></div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-lg">🧠</div>
                  <h2 className="text-lg font-bold text-indigo-950">AI Assistant</h2>
                </div>
                <button 
                  onClick={generateRecommendations}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isGenerating ? "Analyzing..." : "💡 Suggest Content"}
                </button>
              </div>
              
              {recommendations ? (
                <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10 text-sm">
                  {formatLinks(recommendations)}
                </div>
              ) : (
                <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white border-dashed text-center relative z-10">
                  <p className="text-sm text-indigo-600/80 font-medium">Turn on captions and speak to generate relevant study materials instantly.</p>
                </div>
              )}
            </div>

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
                  <p className="text-sm text-gray-400 mt-1">Share the room link to let your audience ask questions.</p>
                </div>
              ) : (
                <div className="space-y-5 pb-8">
                  {questions.map((q, i) => (
                    <div key={i} className="flex flex-col gap-2 animate-fade-in-up">
                      {/* User Question Bubble */}
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-[90%] relative shadow-sm">
                        <span className="absolute -top-2.5 -left-2 text-xl bg-white rounded-full">🙋</span>
                        <p className="font-semibold text-gray-800 text-sm leading-relaxed ml-2">{q.question}</p>
                      </div>
                      
                      {/* AI Answer Bubble */}
                      {q.answer && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 p-4 rounded-2xl rounded-tr-sm self-end max-w-[90%] relative shadow-sm mt-1">
                          <span className="absolute -top-2.5 -right-2 text-xl bg-white rounded-full shadow-sm p-0.5">🤖</span>
                          <p className="text-blue-900 text-sm leading-relaxed mr-2 font-medium">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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