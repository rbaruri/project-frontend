import React from "react";
import { CardProps } from "./types";
import { getCardClasses } from "./helper";

const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => {
  return (
    <div 
      className={getCardClasses(className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card; 