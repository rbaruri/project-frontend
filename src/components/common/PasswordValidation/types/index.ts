export interface PasswordValidationProps {
  password: string;
}

export interface ValidationRule {
  test: (password: string) => boolean;
  message: string;
} 