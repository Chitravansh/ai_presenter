import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    const sessionId = Math.random().toString(36).substring(2, 8);
    navigate(`/presenter/${sessionId}`);
  };

  const handleJoin = () => {
    const sessionId = prompt("Enter Session ID:");
    if (sessionId) {
      navigate(`/audience/${sessionId}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1>AI Presentation System</h1>

      <button onClick={handleStart} style={styles.primaryBtn}>
        Start Seminar
      </button>

      <button onClick={handleJoin} style={styles.secondaryBtn}>
        Join Seminar
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px"
  },
  primaryBtn: {
    padding: "12px 20px",
    margin: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryBtn: {
    padding: "12px 20px",
    margin: "10px",
    backgroundColor: "white",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    cursor: "pointer"
  }
};