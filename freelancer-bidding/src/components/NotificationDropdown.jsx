import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationSeen,
} from "../store/slices/notificationSlice";
import { Bell } from "lucide-react";

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const handleMarkSeen = (id) => {
    dispatch(markNotificationSeen(id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button onClick={() => setDropdownOpen((prev) => !prev)} className="relative">
        <Bell className="w-6 h-6 text-blue-600" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unseenCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white shadow-lg rounded-xl border z-50">
          <div className="p-3 font-semibold border-b">Notifications</div>
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No notifications yet</p>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  onClick={() => handleMarkSeen(notif._id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                    !notif.seen ? "bg-gray-50 font-medium" : "text-gray-600"
                  }`}
                >
                  {notif.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
