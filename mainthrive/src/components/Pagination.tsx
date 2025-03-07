// src/components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // For a sliding window display (example: 4 page numbers at a time)
  const windowSize = 4;
  const startPage = Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
  const endPage = Math.min(startPage + windowSize - 1, totalPages);

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        &laquo;
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded ${page === currentPage ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-green-500`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
