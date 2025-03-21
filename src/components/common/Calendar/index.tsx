import React from "react";
import { CalendarProps } from "@/components/common/Calendar/types/index";
import { getTodayDate } from "@/components/common/Calendar/helper/index";

const Calendar: React.FC<CalendarProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  className = '', 
  disabled = false, 
  minDate 
}) => {
  // Use minDate if provided, otherwise use today as minimum
  const minimumDate = minDate || getTodayDate();

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