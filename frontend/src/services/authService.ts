import {
  AuthResponseData,
  GetProfileResponse,
  LogoutResponseData,
  SignInRequest,
  SignUpRequest,
} from "~/types/auth";
import { BaseService } from "./baseService";

class AuthService extends BaseService {
  constructor() {
    super("auth");
  }

  async login(data: SignInRequest): Promise<AuthResponseData> {
    return this.post<AuthResponseData, SignInRequest>("/login", data);
  }

  async signUp(data: SignUpRequest): Promise<AuthResponseData> {
    return this.post<AuthResponseData, SignUpRequest>("/register", data);
  }

  async logout(): Promise<LogoutResponseData> {
    return this.post<LogoutResponseData, null>("/logout", null);
  }

  async getProfile(): Promise<GetProfileResponse> {
    return this.get<GetProfileResponse>("/profile");
  }
}

export const authService = new AuthService();
