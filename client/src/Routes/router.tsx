import { createBrowserRouter } from "react-router";
import ErrorPage from "../components/ErrorPage";
import MainLayout from "../Layout/MainLayout";
import publicRoute from "./publicRoute";
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import adminRoute from "./adminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <MainLayout />,
    children: [...publicRoute, ...userRoute],
  },
  ...adminRoute, // Move adminRoute to root level
  ...authRoute,
]);

export default router;
