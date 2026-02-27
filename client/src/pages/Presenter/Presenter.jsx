import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaCopy, FaCheckCircle, FaQrcode } from "react-icons/fa";
import api from "../../services/api";
import socket from "../../services/socket";

export default function Presenter() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [pptFile, setPptFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [copied, setCopied] = useState(false);

  const slideRef = useRef(null);

  const sessionLink = `${window.location.origin}/audience/${id}`;

  /* ======================
     Copy Session Link
  ====================== */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  /* ======================
     Fetch Previous Questions
  ====================== */
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await api.get(`/questions/${id}`);
      const formatted = res.data.map((q) => ({
        question: q.text,
        answer: q.answer || null,
      }));
      setQuestions(formatted);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, [id]);

  /* ======================
     Upload PDF
  ====================== */
  const uploadPPT = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(`/upload/${id}`, formData);

      setPptFile(res.data.file);
      setPageNumber(1);
      alert("Slides uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  /* ======================
     Socket Realtime
  ====================== */
  useEffect(() => {
    fetchQuestions();

    socket.emit("join-session", id);

    const questionHandler = (data) => {
      setQuestions((prev) => [...prev, data]);
    };

    socket.on("receive-question", questionHandler);

    return () => {
      socket.off("receive-question", questionHandler);
    };
  }, [id, fetchQuestions]);

  /* ======================
     Keyboard Navigation
  ====================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (!pptFile) return;

      if (e.key === "ArrowRight") {
        setPageNumber((prev) => prev + 1);
      }

      if (e.key === "ArrowLeft") {
        setPageNumber((prev) => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pptFile]);

  /* ======================
     Render
  ====================== */

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* ===== TOP BAR ===== */}
      <div className="bg-white shadow p-4 flex justify-between items-center">

        {/* Session Info */}
        <div>
          <p className="font-semibold text-lg">Session ID: {id}</p>

          <div className="flex gap-2 items-center mt-2">
            <input
              type="text"
              value={sessionLink}
              readOnly
              className="border px-3 py-1 rounded w-80 text-sm bg-gray-50"
            />

            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-2 transition"
            >
              {copied ? <FaCheckCircle /> : <FaCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <FaQrcode className="mx-auto mb-1 text-gray-600" />
          <QRCodeCanvas value={sessionLink} size={100} />
        </div>

      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1">

        {/* LEFT SIDE → SLIDES */}
        <div className="w-1/2 border-r bg-white p-4 flex flex-col items-center">

          <input
            type="file"
            accept=".pdf"
            onChange={uploadPPT}
            className="mb-4"
          />

          {pptFile && (
            <>
              <div
                ref={slideRef}
                className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow"
              >
                <iframe
                  key={pageNumber}
                  src={`http://localhost:5000/uploads/${pptFile}#page=${pageNumber}&zoom=page-width&toolbar=0`}
                  className="w-full h-full"
                  title="slides"
                />
              </div>

              <div className="flex gap-4 mt-4 items-center">

                <button
                  onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Prev
                </button>

                <span className="font-semibold">
                  Slide {pageNumber}
                </span>

                <button
                  onClick={() => setPageNumber((p) => p + 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Next
                </button>

                <button
                  onClick={() => slideRef.current?.requestFullscreen()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Fullscreen
                </button>

              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE → QUESTIONS */}
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">

          <h2 className="font-bold text-lg mb-4">
            Live Questions
          </h2>

          {questions.length === 0 && (
            <p className="text-gray-500">No questions yet.</p>
          )}

          {questions.map((q, i) => (
            <div
              key={i}
              className="border p-3 mb-3 rounded bg-white shadow-sm"
            >
              <p className="font-semibold">
                Q: {q.question}
              </p>

              {q.answer && (
                <p className="text-blue-600 mt-1">
                  AI: {q.answer}
                </p>
              )}
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}