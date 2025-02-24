import React from "react";

interface CalendarProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  minDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ label, name, value, onChange, className = '', disabled = false, minDate }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Use minDate if provided, otherwise use today as minimum
  const minimumDate = minDate || today;

  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        type="date"
        name={name}
        className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        value={value}
        onChange={onChange}
        min={minimumDate}
        aria-label={label}
        disabled={disabled}
      />
    </div>
  );
};

export default Calendar;
