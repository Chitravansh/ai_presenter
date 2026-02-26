import axios from "axios";

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000

export default axios.create({
  baseURL: `http://localhost:${SERVER_PORT}/api`,
});
