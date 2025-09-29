import { io } from "socket.io-client";
import { base_url } from "./base_url";

let socketInstance = null;

export const getSocket = (userId) => {
  if (!socketInstance) {
    socketInstance = io(base_url, {
      transports: ["websocket"],
      auth: { userId },
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
