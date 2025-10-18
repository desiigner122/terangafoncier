import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  label,
  value,
  icon: Icon,
  trend = null,
  trendLabel = null,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  onClick,
}) => {
  const isTrendPositive = trend && trend > 0;
  const isTrendNegative = trend && trend < 0;

  return (
    <div
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer hover:shadow-lg' : ''} p-6 bg-white rounded-lg shadow-md border border-gray-200 transition-all`}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' && value > 999
              ? (value / 1000).toFixed(1) + 'k'
              : value}
          </p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon size={24} className={iconColor} />
        </div>
      </div>

      {/* Trend */}
      {trend !== null && trendLabel && (
        <div className="flex items-center gap-1">
          {isTrendPositive ? (
            <TrendingUp size={16} className="text-green-600" />
          ) : isTrendNegative ? (
            <TrendingDown size={16} className="text-red-600" />
          ) : null}
          <span
            className={`text-sm font-semibold ${
              isTrendPositive
                ? 'text-green-600'
                : isTrendNegative
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {Math.abs(trend)}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
