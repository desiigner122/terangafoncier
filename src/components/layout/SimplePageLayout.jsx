import React from 'react';

const SimplePageLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SimplePageLayout;