import { apiSlice } from "./rtk";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useRegisterMutation } = authApiSlice;
