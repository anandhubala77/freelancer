import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ChatWindow from "./ChatWindow";
import { fetchEligibleChats } from "../services/chatService";
import { getSocket } from "../services/socket";
import { createPortal } from "react-dom";

const ChatLauncher = () => {
  const { user } = useSelector((state) => state.auth);
  const [openList, setOpenList] = useState(false);
  const [eligible, setEligible] = useState([]);
  const [active, setActive] = useState(null); // { projectId, title, partnerId }
  const [unreads, setUnreads] = useState({}); // { [projectId]: count }

  const socket = useMemo(() => (user?._id ? getSocket(user._id) : null), [user?._id]);

  useEffect(() => {
    let mounted = true;
    if (!user?._id) return;
    fetchEligibleChats()
      .then((res) => {
        if (!mounted) return;
        setEligible(res || []);
        // join all project rooms so we receive realtime messages even when chat closed
        res?.forEach((e) => socket?.emit("chat:join", { projectId: e.projectId }));
      })
      .catch(() => {});

    // global incoming listener to update unread counters
    const onIncoming = (msg) => {
      const msgPid = typeof msg.projectId === "object" && msg.projectId !== null ? (msg.projectId._id || msg.projectId) : msg.projectId;
      // if the active chat is open and matches this project, do not count as unread
      const isActive = active && String(active.projectId) === String(msgPid);
      if (!isActive) {
        setUnreads((prev) => ({
          ...prev,
          [String(msgPid)]: (prev[String(msgPid)] || 0) + 1,
        }));
      }
    };
    socket?.on("chat:message", onIncoming);

    return () => {
      mounted = false;
      socket?.off("chat:message", onIncoming);
    };
  }, [user?._id, socket, active]);

  const toggleList = () => setOpenList((v) => !v);

  const totalUnread = Object.values(unreads).reduce((a, b) => a + b, 0);

  if (!user) return null;

  return (
    <>
      {createPortal(
        <button
          onClick={toggleList}
          className="fixed right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-blue-600 text-white shadow-lg w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl hover:bg-blue-700 z-[1000]"
          title="Open chat"
        >
          <span className="relative">
            💬
            {totalUnread > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </span>
        </button>,
        document.body
      )}

      {openList && createPortal(
        <div
          className="fixed right-20 top-1/2 -translate-y-1/2 transform w-64 sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-[1000]"
        >
          <div className="px-3 py-2 border-b bg-gray-50 text-sm font-semibold text-gray-700 flex justify-between items-center">
            <span>Chats</span>
            <button onClick={() => setOpenList(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {eligible.length === 0 && (
              <div className="p-3 text-sm text-gray-500">No active chats. Chats appear after acceptance.</div>
            )}
            {eligible.map((e) => (
              <button
                key={e.projectId}
                onClick={() => {
                  setActive(e);
                  setOpenList(false);
                  setUnreads((prev) => {
                    const n = { ...prev };
                    delete n[String(e.projectId)];
                    return n;
                  });
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 truncate">{e.title || "Project"}</div>
                  <div className="text-xs text-gray-500">Project ID: {e.projectId.slice(0, 6)}…</div>
                </div>
                {!!unreads[String(e.projectId)] && (
                  <span className="ml-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unreads[String(e.projectId)]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}

      {active && (
        <ChatWindow
          user={user}
          isOpen={!!active}
          onClose={() => setActive(null)}
          project={{ _id: active.projectId, title: active.title }}
          partnerId={active.partnerId}
        />
      )}
    </>
  );
};

export default ChatLauncher;
