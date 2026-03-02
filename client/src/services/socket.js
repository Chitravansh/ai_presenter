// import { io } from "socket.io-client";

// const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5000



// const socket = io(`http://localhost:${SERVER_PORT}`, {
//   autoConnect: true,
// });

// export default socket;
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(BASE_URL, {
  autoConnect: true,
});

export default socket;