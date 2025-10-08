/**
 * ADVANCED FILTERS COMPONENT
 * Système de filtres avancés avec presets et reset
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Filter, 
  X, 
  Search, 
  CalendarIcon,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export const AdvancedFilters = ({
  filters = [], // [{ name, label, type, options, placeholder }]
  onApplyFilters,
  onResetFilters,
  presets = [], // [{ label, filters: {...} }]
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilter = (name, value) => {
    const newFilters = { ...currentFilters, [name]: value };
    setCurrentFilters(newFilters);
    
    // Compter les filtres actifs
    const count = Object.values(newFilters).filter(v => 
      v !== undefined && v !== null && v !== ''
    ).length;
    setActiveFiltersCount(count);
  };

  const applyFilters = () => {
    onApplyFilters?.(currentFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setCurrentFilters({});
    setActiveFiltersCount(0);
    onResetFilters?.();
  };

  const applyPreset = (preset) => {
    setCurrentFilters(preset.filters);
    const count = Object.values(preset.filters).filter(v => 
      v !== undefined && v !== null && v !== ''
    ).length;
    setActiveFiltersCount(count);
    onApplyFilters?.(preset.filters);
    setIsOpen(false);
  };

  const renderFilterInput = (filter) => {
    const value = currentFilters[filter.name] || '';

    switch (filter.type) {
      case 'text':
        return (
          <div key={filter.name} className="space-y-2">
            <Label>{filter.label}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={filter.placeholder}
                value={value}
                onChange={(e) => updateFilter(filter.name, e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={filter.name} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select
              value={value}
              onValueChange={(val) => updateFilter(filter.name, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'date':
        return (
          <div key={filter.name} className="space-y-2">
            <Label>{filter.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), 'PPP', { locale: fr }) : filter.placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => updateFilter(filter.name, date?.toISOString())}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'number':
        return (
          <div key={filter.name} className="space-y-2">
            <Label>{filter.label}</Label>
            <Input
              type="number"
              placeholder={filter.placeholder}
              value={value}
              onChange={(e) => updateFilter(filter.name, e.target.value)}
              min={filter.min}
              max={filter.max}
            />
          </div>
        );

      case 'range':
        return (
          <div key={filter.name} className="space-y-2">
            <Label>{filter.label}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={filter.placeholderMin || 'Min'}
                value={currentFilters[`${filter.name}_min`] || ''}
                onChange={(e) => updateFilter(`${filter.name}_min`, e.target.value)}
              />
              <Input
                type="number"
                placeholder={filter.placeholderMax || 'Max'}
                value={currentFilters[`${filter.name}_max`] || ''}
                onChange={(e) => updateFilter(`${filter.name}_max`, e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 relative">
            <SlidersHorizontal className="h-4 w-4" />
            Filtres avancés
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] max-h-[600px] overflow-y-auto" 
          align="end"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filtres avancés</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Presets */}
            {presets.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Filtres rapides
                </Label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-border"></div>

            {/* Filtres dynamiques */}
            <div className="space-y-4">
              {filters.map(filter => renderFilterInput(filter))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex-1"
                disabled={activeFiltersCount === 0}
              >
                Réinitialiser
              </Button>
              <Button
                onClick={applyFilters}
                className="flex-1"
              >
                Appliquer
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Badge des filtres actifs */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -right-2 -top-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {activeFiltersCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
