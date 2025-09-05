import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileDrawer = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    FileText.body
  );
};

export default MobileDrawer;
