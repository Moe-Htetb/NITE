// import DashboardPage from "@/features/admin/pages/DashboardPage";

import { lazy } from "react";
const DashboardPage = lazy(() => import("../features/admin/pages/DashboardPage"));
const ProductPage = lazy(() => import("../features/admin/pages/ProductPage"));
// const CategoryPage = lazy(() => import("../features/admin/pages/CategoryPage"));
const adminRoute = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/products",
    element: <ProductPage />,
  },
];

export default adminRoute;