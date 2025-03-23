import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddFunds = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Mock API call - replace with actual payment processing
      toast.success('Funds added successfully!');
      navigate('/markets');
    } catch (error) {
      toast.error('Failed to add funds');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-[#1C2125] p-8 rounded-xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Add Funds
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Add funds to your trading account using your debit card
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Amount (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  required
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Card Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  maxLength="16"
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Expiry Date</label>
                <input
                  type="text"
                  required
                  maxLength="5"
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    setExpiry(value);
                  }}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">CVV</label>
                <input
                  type="text"
                  required
                  maxLength="3"
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Funds
          </button>
        </form>
      </div>
    </div>
  );
};