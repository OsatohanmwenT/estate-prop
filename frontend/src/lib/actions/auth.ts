import { authService } from "~/services/authService";
import { SignInRequest, SignUpRequest } from "~/types/auth";
import { User } from "~/types/user";

export const loginUser = async ({
  email,
  password,
}: SignInRequest): Promise<{
  success: boolean;
  error?: string;
  user?: User;
}> => {
  try {
    const response = await authService.login({ email, password });
    // Cookies set automatically by backend via axios withCredentials
    return {
      success: true,
      user: response.user,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Login failed" };
  }
};

export const registerUser = async (data: SignUpRequest) => {
  try {
    const response = await authService.signUp(data);
    // Cookies set automatically by backend via axios withCredentials
    return {
      success: true,
      user: response.user,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Registration failed" };
  }
};
