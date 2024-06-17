// src/services/stockService.ts
import axios from 'axios';
import { Stock, StockData } from '../types/stockTypes';

const API_KEY = 'cpn17dpr01qtggba6n40cpn17dpr01qtggba6n4g'
const BASE_URL = 'https://finnhub.io/api/v1'

export const getStockData = async (symbol: string): Promise<StockData> => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const getAllStocks = async (): Promise<Stock[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/symbol`, {
      params: {
        exchange: 'US',
        token: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all stocks:', error);
    throw error;
  }
};
