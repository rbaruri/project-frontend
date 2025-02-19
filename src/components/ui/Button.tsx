import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, isLoading, children }) => {
  return (
    <button
      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"
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
