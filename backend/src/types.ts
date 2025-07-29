// src/types.ts

export interface SignupRequestBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface SignupErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}
