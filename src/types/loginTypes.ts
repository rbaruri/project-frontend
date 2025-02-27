export interface LoginState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
  user: User | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  userId: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  error: string | null;
}

export interface LoginPageProps {
  // Empty for now, can be extended if needed
}
