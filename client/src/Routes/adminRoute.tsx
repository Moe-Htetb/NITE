import { lazy } from "react";
import { productRoute } from "./productRoute";

const AdminLayout = lazy(
  () => import("../features/admin/components/AdminLayout"),
);
const DashboardSection = lazy(
  () => import("../features/admin/components/DashboardSection"),
);

const adminRoute = [
  {
    path: "/dashboard", // Changed from "/" to "/dashboard"
    element: <AdminLayout />,
    children: [
      {
        index: true, // This will match /dashboard
        element: <DashboardSection />,
      },
      ...productRoute,
    ],
  },
];

export default adminRoute;
