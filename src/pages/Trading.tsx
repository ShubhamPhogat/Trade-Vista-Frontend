import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  TradingChart  from '../components/TradingChart';
import { OrderBook } from '../components/OrderBook';
import { TradeForm } from '../components/TradeForm';

export const Trading = () => {
  const { marketId = 'BTC' } = useParams();
  const [orderBook, setOrderBook] = useState<{
    bids: Array<[number, number]>;
    asks: Array<[number, number]>;
  }>({
    bids: [],
    asks: [],
  });

  // Mock order book data - replace with actual API call
  useEffect(() => {
    setOrderBook({
      bids: [
        [45000, 1.5],
        [44900, 2.3],
        [44800, 1.8],
      ],
      asks: [
        [45100, 1.2],
        [45200, 2.1],
        [45300, 1.7],
      ],
    });
  }, [marketId]);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingChart  />
        </div>
        <div className="space-y-6">
          <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
          <TradeForm
            market={marketId}
            baseAsset={marketId}
            quoteAsset="USD"
          />
        </div>
      </div>
    </div>
  );
};