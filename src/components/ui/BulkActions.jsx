/**
 * BULK ACTIONS COMPONENT
 * Opérations en masse avec sélection multiple
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Trash2, 
  Download, 
  Edit, 
  Archive, 
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BulkActions = ({
  selectedItems = [],
  totalItems = 0,
  onSelectAll,
  onDeselectAll,
  actions = [], // [{ label, icon, onClick, variant, requiresConfirm }]
  position = 'fixed', // fixed | static
  className = ''
}) => {
  const selectedCount = selectedItems.length;
  const allSelected = selectedCount === totalItems && totalItems > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalItems;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: position === 'fixed' ? 100 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === 'fixed' ? 100 : 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`
            ${position === 'fixed' ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50' : ''}
            bg-white rounded-lg shadow-xl border border-gray-200 p-4
            flex items-center gap-4
            ${className}
          `}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectAll?.();
                } else {
                  onDeselectAll?.();
                }
              }}
              className="h-5 w-5"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            {actions.slice(0, 3).map((action, i) => (
              <Button
                key={i}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={() => action.onClick(selectedItems)}
                className="gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}

            {actions.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.slice(3).map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => action.onClick(selectedItems)}
                      className="gap-2"
                    >
                      {action.icon && <action.icon className="h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook pour gérer la sélection multiple
export const useBulkSelection = (initialItems = []) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = (items) => {
    setSelectedIds(items.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const isSelected = (id) => selectedIds.includes(id);

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
    selectedCount: selectedIds.length
  };
};

export default BulkActions;
