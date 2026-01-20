import type {
  CreateProductResponse,
  DeleteProductResponse,
  ProductByIdResponse,
  ProductsFilterParams,
  ProductsResponse,
} from "@/types/product";
import { apiSlice } from "./rtk";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<CreateProductResponse, FormData>({
      query: (data) => ({
        url: "/product/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),
    getProducts: builder.query<ProductsResponse, ProductsFilterParams>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["product"],
    }),
    getProductById: builder.query<ProductByIdResponse, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
    }),
    deleteProduct: builder.mutation<DeleteProductResponse, string>({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useGetProductByIdQuery,
} = productApiSlice;
