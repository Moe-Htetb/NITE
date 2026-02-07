import { lazy } from "react";
import { orderRoute } from "./orderRoute";

const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const ProductsPage = lazy(() => import("../features/home/pages/ProductsPage"));
const ProductDetailPage = lazy(
  () => import("../features/home/pages/ProductDetailPage"),
);

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
  ...orderRoute,
];

export default publicRoute;
