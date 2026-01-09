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
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useUpdateUserProfileMutation } = userApiSlice;
