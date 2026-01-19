interface Image {
  url: string;
  public_alt?: string;
  _id: string;
}
export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  instock_count: number;
  is_feature: boolean;
  is_new_arrival: boolean;
  colors: string[];
  images: Image[];
  sizes: string[];
  createdAt: string;
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
