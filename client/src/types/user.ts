export interface UserFilterParams {
  keyword?: string;
  role?: "admin" | "user" | "all" | string;
  sort_by?: string;
  sort_direction?: string;
  page?: number;
  limit?: number;
}
export interface UserResponse {
  data: Array<{
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    profile?: Array<{
      url: string;
      public_alt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
    totalUsers: number;
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

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  profile?: Array<{
    url: string;
    public_alt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
