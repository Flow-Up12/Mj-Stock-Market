import React, { useEffect, useState, useCallback } from 'react';
import { Stock } from '../types/stockTypes';
import { getAllStocks, getStockData } from '../services/stockService';
import Pagination from './Pagination';
import StockFilter from './StockFilter';

interface StockListProps {
  onSelectStock: (symbol: string) => void;
}

const StockList: React.FC<StockListProps> = ({ onSelectStock }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stocksPerPage, setStocksPerPage] = useState(10);
  const [currentStocks, setCurrentStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<{ [key: string]: Stock }>({});
  const [filter, setFilter] = useState({ name: '', category: 'All' });

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getAllStocks();
        setStocks(data);
      } catch (error) {
        console.error('Error fetching all stocks:', error);
      }
      setLoading(false);
    };

    fetchStocks();
  }, []);

  const fetchStockDetails = useCallback(
    async (stocks: Stock[]) => {
      const detailedStocks = await Promise.all(
        stocks.map(async (stock) => {
          if (cache[stock.symbol]) {
            return cache[stock.symbol];
          } else {
            try {
              const stockDetails = await getStockData(stock.symbol);
              const detailedStock = { ...stock, ...stockDetails };
              setCache((prevCache) => ({
                ...prevCache,
                [stock.symbol]: detailedStock,
              }));
              return detailedStock;
            } catch (error) {
              console.error(`Error fetching stock data for ${stock.symbol}:`, error);
              return stock;
            }
          }
        })
      );
      return detailedStocks;
    },
    [cache]
  );

  const getFilteredStocks = useCallback(() => {
    return stocks.filter((stock) => {
      const matchesName = stock.description.toLowerCase().includes(filter.name.toLowerCase());
      const matchesCategory = filter.category === 'All' || stock.category === filter.category;
      return matchesName && matchesCategory;
    });
  }, [stocks, filter]);

  useEffect(() => {
    const fetchCurrentPageStocks = async () => {
      setLoading(true);
      const filteredStocks = getFilteredStocks();
      const indexOfLastStock = currentPage * stocksPerPage;
      const indexOfFirstStock = indexOfLastStock - stocksPerPage;
      const stocksToFetch = filteredStocks.slice(indexOfFirstStock, indexOfLastStock);

      const detailedStocks = await fetchStockDetails(stocksToFetch);
      setCurrentStocks(detailedStocks);
      setLoading(false);
    };

    if (stocks.length > 0) {
      fetchCurrentPageStocks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, stocksPerPage]);

  const totalPages = Math.ceil(getFilteredStocks().length / stocksPerPage);

  const handleFilterChange = (filter: { name: string; category: string }) => {
    setFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Stock List</h1>
      </div>
      <StockFilter onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Symbol</th>
              <th className="py-2 px-4 border-b text-left">Current Price</th>
              <th className="py-2 px-4 border-b text-left">Previous Close</th>
            </tr>
          </thead>
          <tbody>
            {currentStocks.map((stock, index) => (
              <tr
                key={stock.symbol}
                className={`${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                } cursor-pointer`}
                onClick={() => onSelectStock(stock.symbol)}
              >
                <td className="py-2 px-4 border-b">{stock.description}</td>
                <td className="py-2 px-4 border-b">{stock.symbol}</td>
                {/* <td className="py-2 px-4 border-b">{stock.currentPrice}</td>
                <td className="py-2 px-4 border-b">{stock.previousClose}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        stocksPerPage={stocksPerPage}
        onStocksPerPageChange={setStocksPerPage}
      />
    </div>
  );
};

export default StockList;