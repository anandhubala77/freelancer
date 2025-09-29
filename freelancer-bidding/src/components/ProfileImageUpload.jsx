import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadProfileImage } from "../store/slices/authSlice";

const ProfileImageUpload = ({ onPreviewChange }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setFileName(file.name);
    // clean previous url
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    if (onPreviewChange) onPreviewChange(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleUpload = () => {
    if (!image) {
      toast.warning("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", image);

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      toast.error("Session expired or token missing. Please login again.");
      return;
    }

    dispatch(uploadProfileImage({ formData, token }))
      .unwrap()
      .then(() => {
        toast.success("Profile image uploaded successfully!");
        // Optionally clear preview to re-render from stored user.profile
        // if (onPreviewChange) onPreviewChange("");
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="text-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-2"
      />
      {fileName && (
        <div className="mb-2 text-xs text-gray-600 break-all">Selected: {fileName}</div>
      )}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default ProfileImageUpload;
