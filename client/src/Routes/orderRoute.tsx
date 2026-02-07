import { lazy } from "react";
const OrderPage = lazy(() => import("../features/order/pages/OrderPage"));

export const orderRoute = [
  {
    path: "/orders",
    element: <OrderPage />,
  },
];
