/**
 * EMPTY STATE COMPONENT
 * Affichage élégant pour états vides avec actions
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actions = [],
  illustration,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      {illustration && (
        <motion.img
          src={illustration}
          alt=""
          className="mx-auto h-48 w-48 mb-6 opacity-80"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      )}
      
      {Icon && !illustration && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
        >
          <Icon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        </motion.div>
      )}
      
      <motion.h3
        className="text-xl font-semibold text-gray-900 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-muted-foreground mb-6 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
      
      {actions.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {actions.map((action, i) => (
            <Button
              key={i}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              className={action.className}
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
