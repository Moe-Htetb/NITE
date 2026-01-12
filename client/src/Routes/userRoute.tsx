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
const ResetPasswordPage = lazy(
  () => import("../features/user/pages/ResetPasswordPage")
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
    path: "/profile/reset-password",
    element: <ResetPasswordPage />,
  },
];

export default userRoute;
