import React from 'react';

/**
 * Simple ScrollArea component for vertical scrolling.
 * Usage: <ScrollArea className="h-80"> ...content... </ScrollArea>
 */
export const ScrollArea = ({ children, className = '', style = {} }) => {
  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

export default ScrollArea;
