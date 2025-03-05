export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading: boolean;
  error: string | null;
}

export interface ValidationState {
  error: string | null;
} 