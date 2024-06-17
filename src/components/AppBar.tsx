// src/components/AppBar.tsx
import React from 'react';

const AppBar: React.FC = () => {
  return (
    <header className="bg-black text-white py-1 shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">Stock Market App</h1>
      </div>
    </header>
  );
};

export default AppBar;