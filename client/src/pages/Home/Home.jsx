import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Home() {
  const navigate = useNavigate();

  const createSession = async () => {
    const res = await api.post("/sessions/create");
    navigate(`/presenter/${res.data.sessionId}`);
    // console.log("session created");
  };

  const joinSession = () => {
    const id = prompt("Enter Session ID");
    navigate(`/audience/${id}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[400px] text-center space-y-6">

        <h1 className="text-2xl font-bold">AI Presentation System</h1>

        <button
          onClick={createSession}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Start Seminar
        </button>

        <button
          onClick={joinSession}
          className="w-full border py-2 rounded-lg"
        >
          Join Seminar
        </button>

      </div>
    </div>
  );
}
