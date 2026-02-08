import type {
  CreateProductResponse,
  DeleteProductResponse,
  ProductByIdResponse,
  ProductsFilterParams,
  ProductsResponse,
  UpdateProductResponse,
  Product,
} from "@/types/product";
import { apiSlice } from "./rtk";

export interface ProductMetaResponse {
  colors: string[];
  sizes: string[];
  category: string[];
  minPrice: number;
  maxPrice: number;
}

export interface FeaturedProductsResponse {
  product: Product[];
}

export interface NewProductsResponse {
  product: Product[];
}

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
      providesTags: ["product"],
    }),
    updateProduct: builder.mutation<
      UpdateProductResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/product/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<DeleteProductResponse, string>({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
    getProductMeta: builder.query<ProductMetaResponse, void>({
      query: () => ({
        url: "/product/meta",
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    getFeaturedProducts: builder.query<FeaturedProductsResponse, void>({
      query: () => ({
        url: "/product/feature",
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    getNewProducts: builder.query<NewProductsResponse, void>({
      query: () => ({
        url: "/product/new",
        method: "GET",
      }),
      providesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetProductMetaQuery,
  useGetFeaturedProductsQuery,
  useGetNewProductsQuery,
} = productApiSlice;
