import React from "react";

interface CalendarProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
}

const Calendar: React.FC<CalendarProps> = ({ label, name, value, onChange, min }) => {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        type="date"
        name={name}
        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200"
        value={value}
        onChange={onChange}
        min={min}
      />
    </div>
  );
};

export default Calendar;
