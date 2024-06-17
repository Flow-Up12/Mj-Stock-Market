// src/types/stockTypes.ts
export interface Stock {
    description: string;
    symbol: string;
  }
  
  export interface StockData {
    c: number; // Current price
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
    v: number; // Trading volume
  }
  