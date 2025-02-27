export interface LoginState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
  user: UserData | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
  message: string;
}
