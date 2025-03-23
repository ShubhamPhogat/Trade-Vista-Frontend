import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

export const TradeForm = ({ market, baseAsset, quoteAsset }) => {
  const [side, setSide] = useState("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const userId = useAuthStore((state) => state.userId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/v1/order", {
        market,
        side,
        quantity: Number(quantity),
        price: Number(price),
        user_id: userId,
        quoteAsset,
        baseAsset,
        ioc: false,
      });
      console.log(response);
      if (response.data.payload.status === "success") {
        toast.success(
          `Order ${side === "buy" ? "bought" : "sold"} successfully!`
        );
      } else {
        toast.error("Order failed to execute");
      }
    } catch (error) {
      toast.error("Error placing order");
      console.error("Order error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1C2125] p-6 rounded-lg">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded ${
            side === "buy"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setSide("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded ${
            side === "sell"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setSide("sell")}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">
            Price ({quoteAsset})
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Amount ({baseAsset})
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
            step="0.00000001"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            side === "buy" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {side === "buy" ? "Buy" : "Sell"} {baseAsset}
        </button>
      </div>
    </form>
  );
};
