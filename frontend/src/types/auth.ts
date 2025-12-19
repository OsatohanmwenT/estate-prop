import { User } from "./user";

export interface GetProfileResponse {
  user: User;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponseData {
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface LogoutResponseData {
  success: boolean;
  message: string;
}
