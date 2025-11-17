import { lazy } from "react";

const HomePage = lazy(() => import("../features/Home/pages/HomePage"));

const publicRoute = [
  {
    index: true,
    element: <HomePage />,
  },
];

export default publicRoute;
