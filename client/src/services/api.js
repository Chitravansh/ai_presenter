// import axios from "axios";

// const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000

// const api = axios.create({
//   baseURL: `http://localhost:${SERVER_PORT}/api`,
// });

// export default api;

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default api;