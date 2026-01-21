interface Image {
  url: string;
  public_alt?: string;
  _id: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  instock_count: number;
  is_feature: boolean;
  rating_count: number;
  userId: string;
  is_new_arrival: boolean;
  colors: string[];
  images: Image[];
  sizes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
    totalProducts: number;
    totalPages: number;
    from: number | null;
    to: number | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
export interface ProductByIdResponse {
  product: Product;
}

export interface ProductsFilterParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string | string[];
  size?: string | string[];
  sort_by?: string;
  sort_direction?: string;
  page?: number;
  limit?: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  price: string;
  instock_count: string;
  rating_count: string;
  is_feature: boolean;
  is_new_arrival: boolean;
  sizes: string[];
  colors: string[];
  images?: FileList;
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}
export interface UpdateProductResponse {
  success: string;
  message: string;
  product: Product;
}

export interface UpdateProductData extends Partial<
  Omit<Product, "_id" | "createdAt" | "updatedAt" | "userId">
> {
  _id: string;
}

export interface UpdateProductResponse extends Product {
  message: string;
}

export interface DeleteProductResponse {
  message: string;
}
