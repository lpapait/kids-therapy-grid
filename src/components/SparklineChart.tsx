
import React from 'react';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  className?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#3B82F6',
  height = 32,
  width = 80,
  className = ''
}) => {
  if (!data || data.length === 0) {
    return <div className={`${className} flex items-center justify-center`} style={{ height, width }}>
      <div className="text-xs text-gray-400">No data</div>
    </div>;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const lastValue = data[data.length - 1];
  const secondLastValue = data[data.length - 2] || lastValue;
  const trend = lastValue > secondLastValue ? 'up' : lastValue < secondLastValue ? 'down' : 'stable';
  
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : color;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#gradient-${color})`}
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={trendColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Last point highlight */}
        {data.length > 1 && (
          <circle
            cx={(data.length - 1) / (data.length - 1) * width}
            cy={height - ((lastValue - min) / range) * height}
            r="2"
            fill={trendColor}
            stroke="white"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
};

export default SparklineChart;
