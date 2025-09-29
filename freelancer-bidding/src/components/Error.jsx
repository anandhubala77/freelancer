import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const Error = ({ message = "Something went wrong." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-red-600">
      <FaExclamationTriangle className="w-10 h-10 mb-2" />
      <p className="text-center text-lg font-medium">{message}</p>
    </div>
  );
};

export default Error;
