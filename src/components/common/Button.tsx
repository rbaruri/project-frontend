import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled = false, className, isLoading }) => {
  return (
    <button
      className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <>
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Uploading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
