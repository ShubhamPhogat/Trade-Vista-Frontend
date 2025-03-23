import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface KlineData {
  bucket: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartProps {
  className?: string;
}

const TradingChart: React.FC<ChartProps> = ({ className }) => {
  const [chartData, setChartData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<number>(0);
  
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/Kline', {
        interval: "1m",
        market: "BTC"
      });
      console.log("Response data:", response.data);

      // Check if response.data exists and is an array
      if (response.data && Array.isArray(response.data)) {
        // Use the data directly from response.data
        setChartData(prevData => {
          // Keep only the last 100 data points to avoid performance issues
          const newData = [...prevData, ...response.data];
          if (newData.length > 100) {
            return newData.slice(newData.length - 100);
          }
          return newData;
        });
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch chart data');
      setLoading(false);
      console.error('Error fetching chart data:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up interval for continuous fetching
    intervalRef.current = setInterval(fetchData, 1000);
    
    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chartData.length > 0 && canvasRef.current) {
      drawChart();
    } else if (canvasRef.current) {
      // Draw empty chart if no data
      drawEmptyChart();
    }
  }, [chartData, zoomLevel, panOffset]);

  const drawEmptyChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Display message
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Waiting for chart data...', width / 2, height / 2);
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (chartData.length === 0) {
      drawEmptyChart();
      return;
    }

    // Apply zoom and pan
    const visibleData = getVisibleData();
    
    // Find min and max values for scaling
    const prices = visibleData.flatMap(data => [data.high, data.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice > 0 ? maxPrice - minPrice : 1; // Prevent division by zero
    
    // Draw background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines (price levels)
    const priceSteps = 5;
    for (let i = 0; i <= priceSteps; i++) {
      const y = height - (i / priceSteps) * height;
      const price = minPrice + (i / priceSteps) * priceRange;
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Price labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), width - 5, y - 5);
    }
    
    // Draw candlesticks
    const candleWidth = width / (visibleData.length || 1);
    const padding = candleWidth * 0.1;
    const bodyWidth = Math.max(candleWidth - 2 * padding, 1); // Ensure minimum width of 1px
    
    visibleData.forEach((data, index) => {
      const x = index * candleWidth + padding;
      
      // Calculate y positions (inverted for canvas)
      const openY = height - ((data.open - minPrice) / priceRange) * height;
      const closeY = height - ((data.close - minPrice) / priceRange) * height;
      const highY = height - ((data.high - minPrice) / priceRange) * height;
      const lowY = height - ((data.low - minPrice) / priceRange) * height;
      
      // Draw candle wick (high to low)
      ctx.beginPath();
      ctx.moveTo(x + bodyWidth / 2, highY);
      ctx.lineTo(x + bodyWidth / 2, lowY);
      ctx.strokeStyle = data.open > data.close ? '#ef4444' : '#10b981';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw candle body (open to close)
      ctx.fillStyle = data.open > data.close ? '#ef4444' : '#10b981';
      ctx.fillRect(
        x,
        Math.min(openY, closeY),
        bodyWidth,
        Math.abs(closeY - openY) || 1 // Ensure there's at least 1px height
      );
    });
    
    // Draw volume bars at the bottom if we have data
    if (visibleData.length > 0) {
      const volumeHeight = height * 0.2;
      const volumes = visibleData.map(data => data.volume);
      const maxVolume = Math.max(...volumes) || 1; // Prevent division by zero
      
      visibleData.forEach((data, index) => {
        const x = index * candleWidth + padding;
        const volHeight = (data.volume / maxVolume) * volumeHeight;
        
        ctx.fillStyle = data.open > data.close 
          ? 'rgba(239, 68, 68, 0.5)' 
          : 'rgba(16, 185, 129, 0.5)';
        
        ctx.fillRect(
          x,
          height - volHeight,
          bodyWidth,
          volHeight
        );
      });
      
      // Draw latest price
      if (visibleData.length > 0) {
        const latestData = visibleData[visibleData.length - 1];
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Price: ${latestData.close.toFixed(2)}`, 10, 20);
      }
    }
    
    // Draw zoom info
    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Zoom: ${zoomLevel.toFixed(1)}x`, width - 10, 20);
  };

  const getVisibleData = () => {
    if (chartData.length === 0) return [];
    
    // Calculate how many candles to show based on zoom level
    const visibleCount = Math.max(Math.floor(chartData.length / zoomLevel), 1);
    
    // Apply pan offset
    const startIndex = Math.max(
      Math.min(
        chartData.length - visibleCount - panOffset, 
        chartData.length - visibleCount
      ), 
      0
    );
    
    return chartData.slice(startIndex, startIndex + visibleCount);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handlePanLeft = () => {
    setPanOffset(prev => Math.max(prev - 1, 0));
  };

  const handlePanRight = () => {
    setPanOffset(prev => Math.min(prev + 1, chartData.length - 1));
  };

  return (
    <div className={`trading-chart-container ${className || ''}`}>
      <div className="chart-wrapper w-full h-full bg-slate-900 rounded-lg p-4">
        {loading && <div className="loading text-white">Loading chart data...</div>}
        {error && <div className="error text-red-500">{error}</div>}
        {chartData.length === 0 && !loading && !error && (
          <div className="text-white">No data available. Check console for response details.</div>
        )}
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className="w-full h-full"
          />
          <div className="absolute top-2 left-2 flex space-x-2">
            <button 
              onClick={handleZoomIn} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              Zoom In
            </button>
            <button 
              onClick={handleZoomOut} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              Zoom Out
            </button>
            <button 
              onClick={handlePanLeft} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
            >
              ←
            </button>
            <button 
              onClick={handlePanRight} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;