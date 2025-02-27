export interface SignUpState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading: boolean;
  error: string | null;
}

export interface SignUpPageProps {
  // Empty for now, can be extended if needed
}

export interface ValidationState {
  error: string | null;
  setError: (error: string | null) => void;
}
