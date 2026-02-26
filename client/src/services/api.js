import axios from "axios";

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000

const api = axios.create({
  baseURL: `http://localhost:${SERVER_PORT}/api`,
});

export default api;
