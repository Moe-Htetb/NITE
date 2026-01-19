import type { ProductsFilterParams, ProductsResponse } from "@/types/product";
import { apiSlice } from "./rtk";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsFilterParams>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const { useGetProductsQuery, useDeleteProductMutation } =
  productApiSlice;
