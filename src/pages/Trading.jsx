import React from "react";
import { useParams } from "react-router-dom";
import TradingChart from "../components/TradingChart";
import { OrderBook } from "../components/OrderBook";
import { TradeForm } from "../components/TradeForm";

export const Trading = () => {
  const { marketId = "BTC" } = useParams();

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{marketId}/USD</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TradingChart market={marketId} />
          </div>
          <div className="space-y-6">
            <OrderBook market={marketId} />
            <TradeForm
              market={marketId}
              baseAsset={marketId}
              quoteAsset="USD"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
