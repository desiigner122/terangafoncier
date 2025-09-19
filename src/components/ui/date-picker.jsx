import React from 'react';
import { Input } from './input';

const DatePicker = ({ value, onChange, YOUR_API_KEY = "Sélectionner une date", className = "" }) => {
  const handleDateChange = (e) => {
    const selectedDate = e.target.value ? new Date(e.target.value) : null;
    onChange(selectedDate);
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Input
      type="date"
      value={formatDateForInput(value)}
      onChange={handleDateChange}
      YOUR_API_KEY={YOUR_API_KEY}
      className={className}
    />
  );
};

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange, className = "" }) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        YOUR_API_KEY="Date de début"
      />
      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        YOUR_API_KEY="Date de fin"
      />
    </div>
  );
};

export { DatePicker, DateRangePicker };
