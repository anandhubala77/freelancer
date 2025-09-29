import React, { useState } from "react";
import { useSelector } from "react-redux";
import UpdatePassword from "../components/Updatepassword";
import ProfileImageUpload from "../components/ProfileImageUpload";
import { base_url } from "../services/base_url";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [tempPreviewUrl, setTempPreviewUrl] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-700">
          Admin Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          {tempPreviewUrl ? (
            <img
              src={tempPreviewUrl}
              alt="Profile Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow mb-4"
            />
          ) : user?.profile ? (
            (() => {
              const isAbsolute = /^https?:\/\//i.test(user.profile);
              const trimmedBase = base_url.replace(/\/$/, "");
              const src = isAbsolute ? user.profile : `${trimmedBase}/${user.profile}`;
              return (
                <img
                  src={src}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow mb-4"
                />
              );
            })()
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-purple-300 shadow mb-4 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <ProfileImageUpload onPreviewChange={setTempPreviewUrl} />
        </div>

        {/* Info */}
        <div className="space-y-4 mb-8 text-center">
          <div>
            <span className="font-semibold text-gray-700">Name: </span>
            <span className="text-gray-900">{user?.name} {user?.lastName}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email: </span>
            <span className="text-gray-900">{user?.email}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Role: </span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
              user?.role === "admin"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Password Update */}
        <div className="border-t pt-6">
          <UpdatePassword />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
