import React from "react";
import { CardProps } from "@/components/common/Card/types/index";
import { getCardClasses } from "@/components/common/Card/helper/index";

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