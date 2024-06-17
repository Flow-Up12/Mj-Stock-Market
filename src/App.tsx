import React, { useState } from 'react';
import AppBar from './components/AppBar';
import StockDetails from './components/StockDetails';
import StockList from './components/StockList';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <AppBar />
      <main className="container mx-auto p-0 md:p-12 mt-16">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 lg:pr-4 mb-4 lg:mb-0">
            <StockList onSelectStock={setSelectedStock} />
          </div>
          <div className="block sm:hidden lg:w-1/3 lg:pl-4">
            <StockDetails symbol={selectedStock} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;