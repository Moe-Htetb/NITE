import { lazy } from "react";

const HomePage = lazy(() => import("../features/Home/pages/HomePage"));
const ProductsPage = lazy(() => import("../features/Home/pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("../features/Home/pages/ProductDetailPage"));

const publicRoute = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "products",
    element: <ProductsPage />,
  },
  {
    path: "product/:id",
    element: <ProductDetailPage />,
  },
];

export default publicRoute;
