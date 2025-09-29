import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const result = await dispatch(updatePassword({ oldPassword, newPassword }));

    if (updatePassword.fulfilled.match(result)) {
      toast.success("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        // Redirect based on role
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "jobseeker") {
          navigate("/user/jobseeker");
        } else if (user?.role === "hiringperson") {
          navigate("/user/hiring");
        } else {
          navigate("/");
        }
      }, 2000); // Wait 2 seconds to let toast show
    } else {
      toast.error(result.payload || "Failed to update password");
    }
  };

  return (
    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h3>

      <input
        type="password"
        placeholder="Old Password"
        className="w-full p-2 border border-gray-300 rounded"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border border-gray-300 rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        className="w-full p-2 border border-gray-300 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default UpdatePassword;
