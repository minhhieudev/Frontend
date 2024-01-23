// socketManager.js
import io from "socket.io-client";

let socket = null;

export function initSocketConnection() {
  if (!socket) {
    socket = io("http://localhost:8001");
  }
}

export function getSocketInstance() {
  if (!socket) {
    throw new Error("Socket connection not initialized. Call initSocketConnection first.");
  }
  return socket;
}
