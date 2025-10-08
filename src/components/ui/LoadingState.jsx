/**
 * LOADING STATE COMPONENT
 * États de chargement élégants avec skeletons
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingState = ({ 
  type = 'spinner', // spinner | skeleton | pulse
  message = 'Chargement...',
  rows = 3,
  fullScreen = false 
}) => {
  if (type === 'spinner') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex flex-col items-center justify-center gap-3 ${
          fullScreen ? 'min-h-screen' : 'py-12'
        }`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </motion.div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="grid grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingState;
