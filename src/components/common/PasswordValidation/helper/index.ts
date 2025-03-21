import { ValidationRule } from './PasswordValidation.types';

export const validationRules: ValidationRule[] = [
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

export const getValidationItemClass = (password: string, isValid: boolean): string => {
  if (!password) return 'text-gray-500';
  return isValid ? 'text-green-600' : 'text-red-600';
};

export const getValidationIcon = (password: string, isValid: boolean): string => {
  if (!password) return '•';
  return isValid ? '✓' : '×';
}; 