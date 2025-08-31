
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid',
  {
    variants: {
      size: {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-4',
        large: 'h-16 w-16 border-4',
        xl: 'h-24 w-24 border-8',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
);

const Spinner = ({ size, className }) => {
  return (
    <div
      className={cn(
        spinnerVariants({ size }),
        'border-primary border-t-transparent',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

const LoadingSpinner = ({ size, className }) => {
  return (
    <div
      className={cn(
        spinnerVariants({ size }),
        'border-primary border-t-transparent',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};


export { Spinner, LoadingSpinner, spinnerVariants };
