import { apiSlice } from "./rtk";
interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile?: string;
    role: string;
  };
}
export interface UpdateUserProfileRequest extends FormData {
  image: File;
}

export interface UpdateUserNameRequest {
  name: string;
}
export interface UpdateUserNameResponse {
  message: string;
  name: string;
}

export interface UpdateEmailRequest {
  email: string;
}
export interface UpdateEmailResponse {
  success: boolean;
  message: string;
  token?: string;
  email: string;
  devOtp?: string; // for development only
}

export interface VerifyUpdateEmailRequest {
  email: string;
  otp: string;
  token: string;
}

export interface VerifyUpdateEmailResponse {
  success: boolean;
  message: string;
  email: string;
  // user: {
  //   id: string;
  //   name: string;
  //   email: string;
  //   profile?: string;
  //   role: string;
  // };
  // token?: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation<
      UpdateUserProfileResponse,
      UpdateUserProfileRequest
    >({
      query: (data) => ({
        url: "/profileUpload",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateUserName: builder.mutation<
      UpdateUserNameResponse,
      UpdateUserNameRequest
    >({
      query: (data) => ({
        url: "/updateName",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateEmail: builder.mutation<UpdateEmailResponse, UpdateEmailRequest>({
      query: (data) => ({
        url: "/updateEmail",
        method: "POST",
        body: data,
      }),
    }),

    verifyUpdateEmail: builder.mutation<
      VerifyUpdateEmailResponse,
      VerifyUpdateEmailRequest
    >({
      query: (data) => ({
        url: "/verify-update-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useUpdateUserNameMutation,
  useUpdateEmailMutation,
  useVerifyUpdateEmailMutation,
} = userApiSlice;
