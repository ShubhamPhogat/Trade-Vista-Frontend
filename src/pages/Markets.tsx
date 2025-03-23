import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bitcoin, Feather as Ethereum, Coins } from 'lucide-react';

const markets = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    icon: Bitcoin,
    baseAsset: 'BTC',
    quoteAsset: 'USD',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH/USD',
    icon: Ethereum,
    baseAsset: 'ETH',
    quoteAsset: 'USD',
  },
  {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL/USD',
    icon: Coins,
    baseAsset: 'SOL',
    quoteAsset: 'USD',
  },
];

export const Markets = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Markets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((market) => {
          const Icon = market.icon;
          return (
            <button
              key={market.id}
              onClick={() => navigate(`/trade/${market.id}`)}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Icon className="h-8 w-8 text-purple-500" />
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">
                    {market.name}
                  </h2>
                  <p className="text-gray-400">{market.symbol}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};