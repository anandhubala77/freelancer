import React from "react";
import { Trash2, Pencil } from "lucide-react";
import Button from "./Button";

const JobCard = ({ job, onEdit, onDelete }) => {
  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "Unknown Date";

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white flex flex-col justify-between h-full">
      {/* Project Image */}
      {job.image && (
        <img
          src={job.image}
          alt="Project"
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}

      {/* Job Info Section */}
      <div>
        <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
          {job.description}
        </p>

        {/* Skills */}
        {job.skillsRequired && (
          <p className="text-sm text-gray-700 mb-1">
            <strong>Skills:</strong> {Array.isArray(job.skillsRequired)
              ? job.skillsRequired.join(", ")
              : job.skillsRequired}
          </p>
        )}

        {/* Timeline & Location */}
        <p className="text-sm text-gray-700 mb-1">
          <strong>Timeline:</strong> {job.timeline || "Not specified"}
        </p>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Location:</strong> {job.location || "Remote"}
        </p>

        {/* Budget & Date */}
        <p className="text-blue-600 text-sm font-medium mt-1">
          Budget: ${job.budget}
        </p>
        <p className="text-xs text-gray-500 mt-1">Posted on: {formattedDate}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onEdit}
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 w-full py-2 text-sm flex items-center justify-center"
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>

        <Button
          onClick={onDelete}
          className="bg-red-100 text-red-800 hover:bg-red-200 w-full py-2 text-sm flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
