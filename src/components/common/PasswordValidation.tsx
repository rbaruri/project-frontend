import React from 'react';

interface PasswordValidationProps {
  password: string;
}

interface ValidationRule {
  test: (password: string) => boolean;
  message: string;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  const validationRules: ValidationRule[] = [
    {
      test: (pwd) => pwd.length >= 8,
      message: 'At least 8 characters long'
    },
    {
      test: (pwd) => /[A-Z]/.test(pwd),
      message: 'Contains at least one uppercase letter'
    },
    {
      test: (pwd) => /[0-9]/.test(pwd),
      message: 'Contains at least one number'
    },
    {
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      message: 'Contains at least one special character'
    }
  ];

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium text-gray-700">Password must:</p>
      <ul className="list-none space-y-1 text-sm">
        {validationRules.map((rule, index) => (
          <li
            key={index}
            className={`flex items-center space-x-2 ${
              password ? (rule.test(password) ? 'text-green-600' : 'text-red-600') : 'text-gray-500'
            }`}
          >
            <span>
              {password ? (
                rule.test(password) ? (
                  '✓'
                ) : (
                  '×'
                )
              ) : (
                '•'
              )}
            </span>
            <span>{rule.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordValidation; 