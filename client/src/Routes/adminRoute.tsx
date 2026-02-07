import { lazy } from "react";
import { productRoute } from "./productRoute";

const AdminLayout = lazy(
  () => import("../features/admin/components/AdminLayout"),
);
const DashboardSection = lazy(
  () => import("../features/admin/components/DashboardSection"),
);
const UserPage = lazy(() => import("../features/admin/pages/UserPage"));
const OrderPage = lazy(() => import("../features/admin/pages/OrderPage"));

const adminRoute = [
  {
    path: "/dashboard", // Changed from "/" to "/dashboard"
    element: <AdminLayout />,
    children: [
      {
        index: true, // This will match /dashboard
        element: <DashboardSection />,
      },
      {
        path: "/dashboard/users",
        element: <UserPage />,
      },
      {
        path: "/dashboard/orders",
        element: <OrderPage />,
      },
      ...productRoute,
    ],
  },
];

export default adminRoute;
