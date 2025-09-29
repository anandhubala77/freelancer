import React from "react";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded border ${canPrev ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        disabled={!canPrev}
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => canNext && onPageChange(currentPage + 1)}
        className={`px-3 py-1 rounded border ${canNext ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
