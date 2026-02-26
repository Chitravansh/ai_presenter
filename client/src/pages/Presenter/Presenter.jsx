import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
     Copy Link
  ====================== */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(sessionLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
     Upload PDF
  ====================== */
  const uploadPPT = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/upload/${id}`, formData);

    setPptFile(res.data.file);
    setPageNumber(1);
    alert("Slides uploaded!");
  };

  /* ======================
     Socket Realtime
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
      if (!pptFile) return;

      if (e.key === "ArrowRight") setPageNumber((p) => p + 1);
      if (e.key === "ArrowLeft")
        setPageNumber((p) => Math.max(p - 1, 1));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pptFile]);

  return (
    <div className="h-screen flex flex-col">

      {/* TOP BAR → QR + COPY */}
      <div className="bg-white shadow p-4 flex justify-between items-center">

        <div>
          <p className="font-semibold">Session ID: {id}</p>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="text"
              value={sessionLink}
              readOnly
              className="border px-2 py-1 rounded w-80 text-sm"
            />
            <button
              onClick={handleCopy}
              className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              {copied ? <FaCheckCircle /> : <FaCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <FaQrcode className="mb-1" />
          <QRCodeCanvas value={sessionLink} size={100} />
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1">

        {/* LEFT → SLIDES */}
        <div className="w-1/2 border-r bg-gray-50 p-4 flex flex-col items-center">

          <input
            type="file"
            accept=".pdf"
            onChange={uploadPPT}
            className="mb-3"
          />

          {pptFile && (
            <>
              <div
                ref={slideRef}
                className="w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow"
              >
                <iframe
                  key={pageNumber}
                  src={`http://localhost:5000/uploads/${pptFile}#page=${pageNumber}&zoom=page-width`}
                  className="w-full h-full"
                  title="slides"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    setPageNumber((p) => Math.max(p - 1, 1))
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Prev
                </button>

                <span className="font-semibold">
                  Slide {pageNumber}
                </span>

                <button
                  onClick={() => setPageNumber((p) => p + 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Next
                </button>

                <button
                  onClick={() =>
                    slideRef.current?.requestFullscreen()
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Fullscreen
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT → QUESTIONS */}
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-100">
          <h2 className="font-bold mb-4">Live Questions</h2>

          {questions.map((q, i) => (
            <div
              key={i}
              className="border p-3 my-2 rounded bg-white"
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