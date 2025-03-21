import React from "react";
import { ButtonProps } from "./types";
import { getButtonClasses } from "./helper";

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className, 
  isLoading 
}) => {
  return (
    <button
      className={getButtonClasses(className)}
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