import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HiringUpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    profileimg: "",
    companyName: "",
    companyDescription: "",
    position: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        profileimg: user.profileimg || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        position: user.position || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(form)).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/user/hiring");
    } catch (err) {
      toast.error(err || "Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Update Hiring Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="text"
          name="profileimg"
          value={form.profileimg}
          onChange={handleChange}
          placeholder="Profile Image URL"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Your Position"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="companyDescription"
          value={form.companyDescription}
          onChange={handleChange}
          placeholder="Company Description"
          className="w-full p-2 border rounded"
          rows={3}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default HiringUpdateProfile;
