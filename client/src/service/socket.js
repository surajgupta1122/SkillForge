import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (userId, userRole) => {
  if (socket) socket.disconnect();
  socket = io("http://localhost:5000", {
    query: { userId, userRole },
    transports: ["websocket"],
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 