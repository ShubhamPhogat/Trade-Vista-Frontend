import React, { useEffect, useState } from "react";
import axios from "axios";

export const OrderBook = ({ market }) => {
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: [],
  });

  useEffect(() => {
    const fetchDepth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/Kline/depth",
          {
            market,
          }
        );

        setOrderBook({
          bids: response.data.payload.depthBid || [],
          asks: response.data.payload.depthAsk || [],
        });
      } catch (error) {
        console.error("Error fetching depth:", error);
      }
    };

    fetchDepth();
    const interval = setInterval(fetchDepth, 1000);

    return () => clearInterval(interval);
  }, [market]);

  return (
    <div className="bg-[#1C2125] p-4 rounded-lg">
      <h2 className="text-white text-xl mb-4">Order Book</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-green-400 mb-2">Bids</h3>
          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            style={{ height: "300px" }}
          >
            <div className="space-y-1">
              {orderBook.bids.map(([price, volume]) => (
                <div
                  key={price}
                  className="flex justify-between bg-green-900/20 p-2 rounded"
                >
                  <span className="text-green-400">{price.toFixed(2)}</span>
                  <span className="text-white">{volume.toFixed(8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-red-400 mb-2">Asks</h3>
          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            style={{ height: "300px" }}
          >
            <div className="space-y-1">
              {orderBook.asks.map(([price, volume]) => (
                <div
                  key={price}
                  className="flex justify-between bg-red-900/20 p-2 rounded"
                >
                  <span className="text-red-400">{price.toFixed(2)}</span>
                  <span className="text-white">{volume.toFixed(8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
