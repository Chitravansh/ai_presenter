import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react"; // ✅ added useRef
import api from "../../services/api";
import socket from "../../services/socket";

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000

export default function Presenter() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [pptFile, setPptFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const slideRef = useRef(null); // ✅ REQUIRED for fullscreen



  /* ======================
     Fetch old questions
  ====================== */

  const fetchQuestions = async () => {
    const res = await api.get(`/questions/${id}`);

    const formatted = res.data.map((q) => ({
      question: q.text,
      answer: null,
    }));

    setQuestions(formatted);
  };



  /* ======================
     Upload slides
  ====================== */

  const uploadPPT = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/upload/${id}`, formData);

    setPptFile(res.data.file);
    setPageNumber(1); // reset to first slide
    alert("Slides uploaded!");
  };



  /* ======================
     Socket realtime
  ====================== */

  useEffect(() => {
    
    fetchQuestions();

    socket.emit("join-session", id);

    const handler = (data) => {
      setQuestions((prev) => [...prev, data]);
    };

    socket.on("receive-question", handler);

    return () => socket.off("receive-question", handler);
  }, [id]);

  /* ======================
   Keyboard navigation
====================== */

useEffect(() => {
  const handleKey = (e) => {
    if (!pptFile) return; // only after slides loaded

    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPageNumber(p => p + 1);
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPageNumber(p => Math.max(p - 1, 1));
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => window.removeEventListener("keydown", handleKey);
}, [pptFile]);




  /* ======================
     UI
  ====================== */

  return (
    <div className="h-screen flex">

      {/* LEFT → SLIDES */}
      <div className="w-1/2 border-r bg-gray-50 p-3 flex flex-col items-center">

        <input
          type="file"
          accept=".pdf"
          onChange={uploadPPT}
          className="mb-3"
        />

        {pptFile && (
          <>
            {/* Slide container */}
            <div
              ref={slideRef} // ✅ fullscreen target
              className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow"
            >
              <iframe
                key={pageNumber}
                src={`http://localhost:${SERVER_PORT}/uploads/${pptFile}#page=${pageNumber}&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full"
                title="slides"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Prev
              </button>

              <span className="font-semibold">
                Slide {pageNumber}
              </span>

              <button
                onClick={() => setPageNumber(p => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Next
              </button>

              <button
                onClick={() => slideRef.current?.requestFullscreen()} // ✅ works now
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Fullscreen
              </button>

            </div>
          </>
        )}
      </div>



      {/* RIGHT → QUESTIONS */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Live Questions</h2>

        {questions.map((q, i) => (
          <div key={i} className="border p-3 my-2 rounded bg-white">
            <p className="font-semibold">Q: {q.question}</p>

            {q.answer && (
              <p className="text-blue-600 mt-1">AI: {q.answer}</p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
