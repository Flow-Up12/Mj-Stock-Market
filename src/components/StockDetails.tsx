// src/components/StockDetails.tsx
import React, { useEffect, useState } from 'react';
import { StockData } from '../types/stockTypes';
import { getStockData } from '../services/stockService';

interface StockDetailsProps {
  symbol: string | null;
}

const StockDetails: React.FC<StockDetailsProps> = ({ symbol }) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      if (symbol) {
        setLoading(true);
        try {
          const data = await getStockData(symbol);
          setStockData(data);
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (!stockData) {
    return <div className="p-4 bg-white shadow-md rounded-lg">Select a stock to see details</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Stock Details for {symbol}</h2>
          <p>Current Price: ${stockData.c}</p>
          <p>High Price of the Day: ${stockData.h}</p>
          <p>Low Price of the Day: ${stockData.l}</p>
          <p>Open Price of the Day: ${stockData.o}</p>
          <p>Previous Close Price: ${stockData.pc}</p>
          <p>Volume: {stockData.v}</p>
        </>
      )}
    </div>
  );
};

export default StockDetails;