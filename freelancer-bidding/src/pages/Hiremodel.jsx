// components/HireModal.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const HireModal = ({ jobId, senderId, onClose }) => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedSeekerId, setSelectedSeekerId] = useState("");

  useEffect(() => {
    axios.get("/api/users/jobseekers") // You'll need this endpoint
      .then(res => setJobSeekers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSend = async () => {
    try {
      await axios.post("/api/hire-requests/send", {
        jobId,
        senderId,
        receiverId: selectedSeekerId,
        message
      });
      alert("Request sent!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal">
      <h2>Select Job Seeker</h2>
      <select onChange={(e) => setSelectedSeekerId(e.target.value)}>
        <option value="">Select</option>
        {jobSeekers.map(js => (
          <option key={js._id} value={js._id}>{js.name}</option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
      />

      <button onClick={handleSend}>Send Request</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default HireModal;
