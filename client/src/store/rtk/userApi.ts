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
    updateUserName: builder.mutation({
      query: (data) => ({
        url: "/updateName",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useUpdateUserProfileMutation, useUpdateUserNameMutation } =
  userApiSlice;
