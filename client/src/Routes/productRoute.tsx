import { lazy } from "react";

const AddProductForm = lazy(
  () => import("../features/admin/components/product/AddProductForm"),
);
const ProductPage = lazy(() => import("../features/admin/pages/ProductPage"));
const ProductDetailPage = lazy(
  () => import("../features/admin/pages/ProductDetailPage"),
);
const ProductEditPage = lazy(
  () => import("../features/admin/pages/ProductEditPage"),
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
    path: "products/edit-product/:id",
    element: <ProductEditPage />,
  },
  {
    path: "products/:id",
    element: <ProductDetailPage />,
  },
];
