export interface Order {
  market: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  user_id: string;
  quoteAsset: string;
  baseAsset: string;
  ioc: boolean;
}

export interface KlineData {
  interval: string;
  market: string;
}

export interface OrderResponse {
  type: string;
  payload: {
    executedOrder: {
      market: string;
      side: string;
      quantity: number;
      user_id: string;
      order_id: string;
      filled: number;
      price: number;
      cancelled: boolean;
      ioc: boolean;
    };
  };
  status: string;
}