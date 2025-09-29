import axios from "axios";
import { base_url } from "./base_url";

export const getAuthHeader = () => {
  const user = sessionStorage.getItem("user");
  const parsed = user ? JSON.parse(user) : null;
  const token = parsed?.token || sessionStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };

};

export const fetchEligibleChats = async () => {
  const headers = getAuthHeader();
  const { data } = await axios.get(`${base_url}/chat/eligible`, { headers });
  return data; // [{ projectId, title, partnerId }]
};

export const fetchChatHistory = async (projectId, limit = 100) => {
  const headers = getAuthHeader();
  const { data } = await axios.get(
    `${base_url}/chat/${projectId}/history?limit=${limit}`,
    { headers }
  );
  return data; // [messages]
};

export const sendChatMessage = async ({ projectId, receiverId, message }) => {
  const headers = getAuthHeader();
  const { data } = await axios.post(
    `${base_url}/chat/${projectId}/send`,
    { receiverId, message },
    { headers }
  );
  return data; // saved message
};
