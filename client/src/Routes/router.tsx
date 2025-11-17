import { createBrowserRouter } from "react-router";
import ErrorPage from "../components/ErrorPage";
import MainLayout from "../Layout/MainLayout";
import publicRoute from "./publicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <MainLayout />,
    children: [...publicRoute],
  },
]);

export default router;
