import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../services/socket";
import { fetchChatHistory, sendChatMessage } from "../services/chatService";

const ChatWindow = ({ user, isOpen, onClose, project, partnerId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const socket = useMemo(() => (user?._id ? getSocket(user._id) : null), [user?._id]);

  useEffect(() => {
    if (!isOpen || !project?._id) return;

    // load history
    fetchChatHistory(project._id).then((data) => setMessages(data || []));

    // join room
    socket?.emit("chat:join", { projectId: project._id });

    const onIncoming = (msg) => {
      const msgPid = typeof msg.projectId === "object" && msg.projectId !== null ? (msg.projectId._id || msg.projectId) : msg.projectId;
      if (String(msgPid) === String(project._id)) {
        setMessages((prev) => {
          // de-duplicate by _id if present
          if (msg._id && prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket?.on("chat:message", onIncoming);

    return () => {
      socket?.off("chat:message", onIncoming);
    };
  }, [isOpen, project?._id, socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    try {
      await sendChatMessage({
        projectId: project._id,
        receiverId: partnerId,
        message: text,
      });
      // do not optimistically append; rely on socket event to avoid duplicates
    } catch (e) {
      // fallback UI notification could be added
    }
  };

  return (
    <div className="fixed right-4 bottom-20 w-80 sm:w-96 bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col overflow-hidden z-50">
      <div className="px-4 py-2 bg-blue-600 text-white flex justify-between items-center">
        <span className="font-semibold text-sm truncate">Chat • {project?.title || "Project"}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
      </div>
      <div className="p-3 h-72 overflow-y-auto bg-gray-50">
        {messages.map((m) => (
          <div key={m._id || m.timestamp} className={`mb-2 flex ${m.senderId === user?._id ? "justify-end" : "justify-start"}`}>
            <div className={`${m.senderId === user?._id ? "bg-blue-500 text-white" : "bg-white text-gray-800"} px-3 py-2 rounded-lg shadow-sm max-w-[75%] text-sm`}>
              <div>{m.message}</div>
              <div className="text-[10px] opacity-70 mt-1">
                {new Date(m.timestamp || m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-2 border-t bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
