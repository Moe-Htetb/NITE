import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";

let baseUrl =
  import.meta.env.NODE_ENV === "development"
    ? import.meta.env.LOCAL_API_URL
    : import.meta.env.API_URL;
console.log(baseUrl);

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1",
    credentials: "include",
  }),
  tagTypes: ["auth"],

  endpoints: () => ({}),
});
