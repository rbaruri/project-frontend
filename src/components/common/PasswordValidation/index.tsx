import React from 'react';
import { PasswordValidationProps } from './types/index';
import { 
  validationRules, 
  getValidationItemClass, 
  getValidationIcon 
} from './helper/index';

const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium text-gray-700">Password must:</p>
      <ul className="list-none space-y-1 text-sm">
        {validationRules.map((rule, index) => {
          const isValid = rule.test(password);
          return (
            <li
              key={index}
              className={`flex items-center space-x-2 ${getValidationItemClass(password, isValid)}`}
            >
              <span>{getValidationIcon(password, isValid)}</span>
              <span>{rule.message}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordValidation; 