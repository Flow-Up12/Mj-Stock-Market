// src/components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  stocksPerPage: number;
  onStocksPerPageChange: (num: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  stocksPerPage,
  onStocksPerPageChange
}) => {
  return (
    <div className="pagination mt-4 flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        &lt;
      </button>
      <span className="text-lg">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
      <select
        value={stocksPerPage}
        onChange={(e) => onStocksPerPageChange(Number(e.target.value))}
        className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
};

export default Pagination;