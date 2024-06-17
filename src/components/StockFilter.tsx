// src/components/StockFilter.tsx
import React, { useState } from 'react';

interface StockFilterProps {
  onFilterChange: (filter: { name: string; category: string }) => void;
}

const categories = [
  'All',
  'Technology',
  'Finance',
  'Healthcare',
  'Energy',
  // Add more categories as needed
];

const StockFilter: React.FC<StockFilterProps> = ({ onFilterChange }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('All');

  const handleFilterChange = () => {
    onFilterChange({ name, category });
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Filter by name"
        className="px-4 py-2 border rounded mr-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 border rounded"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button
        onClick={handleFilterChange}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
};

export default StockFilter;