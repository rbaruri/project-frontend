export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface LoginState {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  loading: boolean;
  error: string | null;
}

export interface LoginError {
  message: string;
  field?: string;
} 