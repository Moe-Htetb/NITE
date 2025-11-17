import { createBrowserRouter } from "react-router";
import ErrorPage from "../components/ErrorPage";
import MainLayout from "../Layout/MainLayout";
import publicRoute from "./publicRoute";
import authRoute from "./authRoute";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <MainLayout />,
    children: [...publicRoute, ...authRoute],
  },
]);

export default router;
