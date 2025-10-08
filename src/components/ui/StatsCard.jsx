/**
 * STATS CARD COMPONENT
 * Cartes de statistiques uniformes et animées
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend = null, // { value: 12, direction: 'up' | 'down' | 'neutral' }
  description,
  loading = false,
  onClick,
  color = 'blue', // blue | green | red | yellow | purple
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  const TrendIcon = trend?.direction === 'up' 
    ? TrendingUp 
    : trend?.direction === 'down' 
    ? TrendingDown 
    : Minus;

  const trendColorClass = trend?.direction === 'up'
    ? 'text-green-600'
    : trend?.direction === 'down'
    ? 'text-red-600'
    : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-3xl font-bold text-gray-900">
                  {value}
                </h3>
              )}
            </div>
            {Icon && (
              <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>

          {(trend || description) && (
            <div className="flex items-center justify-between text-sm">
              {trend && (
                <div className={`flex items-center gap-1 font-medium ${trendColorClass}`}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{trend.value}%</span>
                </div>
              )}
              {description && (
                <p className="text-muted-foreground text-xs">
                  {description}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
