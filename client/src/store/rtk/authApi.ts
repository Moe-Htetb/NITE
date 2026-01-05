import { apiSlice } from "./rtk";

// Define types for your API responses
export interface RegisterResponse {
  status: number;
  success: boolean;
  message: string;
  token?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface VerifyRegisterOtpRequest {
  name: string;
  email: string;
  password: string;
  otp: string;
  token: string;
}

export interface VerifyRegisterOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
  token: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["auth"],
    }),

    verifyRegisterOtp: builder.mutation<
      VerifyRegisterOtpResponse,
      VerifyRegisterOtpRequest
    >({
      query: (data) => ({
        url: "/verify-register-otp",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["auth"],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useLoginMutation,
} = authApiSlice;
