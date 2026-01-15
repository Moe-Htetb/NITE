import { lazy } from "react";

const UserProfilePage = lazy(
  () => import("../features/user/pages/UserProfilePage")
);

const UpdateEmailPage = lazy(
  () => import("../features/user/pages/UpdateEmailPage")
);
const VerifyUpdateEmailPage = lazy(
  () => import("../features/user/pages/VerifyUpdateEmailPage")
);
const UpdateNamePage = lazy(
  () => import("../features/user/pages/UpdateNamePage")
);
const UpdatePasswordPage = lazy(
  () => import("../features/user/pages/UpdatePasswordPage")
);

const userRoute = [
  {
    path: "/profile",
    element: <UserProfilePage />,
  },
  {
    path: "/profile/update-email",
    element: <UpdateEmailPage />,
  },
  {
    path: "/profile/update-name",
    element: <UpdateNamePage />,
  },
  {
    path: "/profile/verify-update-email",
    element: <VerifyUpdateEmailPage />,
  },
  {
    path: "/profile/update-password",
    element: <UpdatePasswordPage />,
  },
];

export default userRoute;
