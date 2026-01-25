import type { UserFilterParams, UserResponse } from "@/types/user";
import { apiSlice } from "./rtk";

const adminApSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, UserFilterParams>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["admin"],
    }),
  }),
});

export const { useGetUsersQuery } = adminApSlice;
