import { lazy } from "react";

const AddProductForm = lazy(
  () => import("../features/admin/components/product/AddProductForm"),
);
const ProductPage = lazy(() => import("../features/admin/pages/ProductPage"));
const ProductDetailPage = lazy(
  () => import("../features/admin/pages/ProductDetailPage"),
);

export const productRoute = [
  {
    path: "products",
    element: <ProductPage />,
  },
  {
    path: "products/add-product",
    element: <AddProductForm />,
  },
  {
    path: "products/:id",
    element: <ProductDetailPage />,
  },
];
