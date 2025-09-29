import React from "react";
import { FaGavel } from "react-icons/fa";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold">
      <FaGavel className="text-blue-500" />
      <span className="text-gray-800">Freelance</span>
      <span className="text-blue-500">Bid</span>
    </div>
  );
};

export default Logo;