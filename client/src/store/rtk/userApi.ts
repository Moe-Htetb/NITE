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
  message: string;
  email: string;
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
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useUpdateUserNameMutation,
  useUpdateEmailMutation,
} = userApiSlice;
