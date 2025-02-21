import React from "react";

interface CalendarProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ label, name, value, onChange, className }) => {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        type="date"
        name={name}
        className={className}
        value={value}
        onChange={onChange}
        aria-label={label}
      />
    </div>
  );
};

export default Calendar;
