import { lazy } from "react";

const AddProductForm = lazy(
  () => import("../features/admin/components/product/AddProductForm"),
);
const ProductPage = lazy(() => import("../features/admin/pages/ProductPage"));

export const productRoute = [
  {
    path: "products",
    element: <ProductPage />,
  },
  {
    path: "products/add-product",
    element: <AddProductForm />,
  },
];
