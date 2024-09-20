import React, { useEffect, useState, useCallback } from "react";
import { Stock } from "../types/stockTypes";
import { getAllStocks, getStockData } from "../services/stockService";
import Pagination from "./Pagination";
import StockFilter from "./StockFilter";
import StockDetails from "./StockDetails";

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
  const [filter, setFilter] = useState({ name: "", category: "All" });
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getAllStocks();
        setStocks(data);
      } catch (error) {
        console.error("Error fetching all stocks:", error);
      }
      setLoading(false);
    };

    setCurrentPage(1);
    setCurrentStocks(stocks.slice(0, stocksPerPage));

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
              console.error(
                `Error fetching stock data for ${stock.symbol}:`,
                error
              );
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
      const matchesName = stock.description
        .toLowerCase()
        .includes(filter.name.toLowerCase());
      // const matchesCategory = filter.category === 'All' || stock.category === filter.category;
      return matchesName;
    });
  }, [stocks, filter]);

  useEffect(() => {
    const fetchCurrentPageStocks = async () => {
      setLoading(true);
      const filteredStocks = getFilteredStocks();
      const indexOfLastStock = currentPage * stocksPerPage;
      const indexOfFirstStock = indexOfLastStock - stocksPerPage;
      const stocksToFetch = filteredStocks.slice(
        indexOfFirstStock,
        indexOfLastStock
      );

      const detailedStocks = await fetchStockDetails(stocksToFetch);
      setCurrentStocks(detailedStocks);
      setLoading(false);
    };

    if (stocks.length > 0) {
      fetchCurrentPageStocks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, stocksPerPage, filter]);

  const totalPages = Math.ceil(getFilteredStocks().length / stocksPerPage);

  const handleFilterChange = (filter: { name: string; category: string }) => {
    setFilter(filter);
    setCurrentPage(1);
  };

  const toggleAccordion = async (symbol: string) => {
    if (openAccordion === symbol) {
      setOpenAccordion(null);
      return;
    }

    // setOpenAccordion(symbol);
    // setSelectedStockName(description);

    // // Fetch available data for the selected stock
    // try {
    //   const stockDetails = await getStockData(symbol);
    //   const chartData = {
    //     current: stockDetails.c,
    //     high: stockDetails.h,
    //     low: stockDetails.l,
    //     open: stockDetails.o,
    //     previousClose: stockDetails.pc,
    //   };
  }


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Stock List</h1>
      </div>
      <div className="p-2">
        <StockFilter onFilterChange={handleFilterChange} />
      </div>
      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <>
          <div className="block sm:hidden">
            {currentStocks.map((stock, index: number) => (
              <div key={stock.symbol + `${index}`} className="border-b">
                <button
                  className={`w-full text-left py-2 px-4 ${
                    index % 2 === 0 ? "bg-gray-200" : "bg-white"
                  } focus:outline-none flex justify-between items-center`}
                  onClick={() =>
                    toggleAccordion(stock.symbol)
                  }
                >
                  <span>
                    {stock.description} ({stock.symbol})
                  </span>
                  <span
                    className={`transform transition-transform ${
                      openAccordion === stock.symbol ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </button>
                // In the component's JSX
                {openAccordion === stock.symbol && (
                  <div className="p-3 pb-2">
                    <StockDetails symbol={stock.symbol} />
                    
                  </div>
                )}
              </div>
            ))}
          </div>
          <table className="hidden sm:table min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Symbol</th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock, index) => (
                <tr
                  key={stock.symbol}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
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
        </>
      )}
      <div className="p-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          stocksPerPage={stocksPerPage}
          onStocksPerPageChange={setStocksPerPage}
        />
      </div>
    </div>
  );
};

export default StockList;
