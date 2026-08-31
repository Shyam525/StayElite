import api from "@/lib/axios";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: "GUEST" | "HOST" | "ADMIN";
  emailVerified: boolean;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
};

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", { email, password });
    return data.data;
  },

  register: async (payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data.data;
  },

  logout: async (refreshToken?: string) => {
    if (!refreshToken) {
      return;
    }

    await api.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/refresh", null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return data.data;
  },
};
