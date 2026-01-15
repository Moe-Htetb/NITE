import { lazy } from "react";

const SignInPage = lazy(() => import("../features/auth/pages/SignInPage"));
const SignUpPage = lazy(() => import("../features/auth/pages/SignUpPage"));
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage")
);
const VerifyOtpPage = lazy(
  () => import("../features/auth/pages/VerifyOtpPage")
);
const ResetPasswordPage = lazy(
  () => import("../features/auth/pages/ResetPasswordPage")
);

const authRoute = [
  {
    path: "/login",
    element: <SignInPage />,
  },
  {
    path: "/register",
    element: <SignUpPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
];
export default authRoute;
