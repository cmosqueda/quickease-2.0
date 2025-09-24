import AuthChangeEmailPage from "@/routes/(auth)/AuthChangeEmail";
import AuthChangePasswordPage from "@/routes/(auth)/AuthChangePassword";
import AuthForgotPasswordPage from "@/routes/(auth)/AuthForgotPassword";
import AuthLayout from "@/routes/(auth)/AuthLayout";
import AuthLoginPage from "@/routes/(auth)/AuthLogin";
import AuthRegisterPage from "@/routes/(auth)/AuthRegister";
import AuthVerifyEmailPage from "@/routes/(auth)/AuthVerifyEmail";

import { checkAuthAndRedirect } from "@/utils/router";
import type { RouteObject } from "react-router";

/**
 * Defines the route configuration for authentication-related pages.
 *
 * @remarks
 * This route object includes paths for login, registration, password and email changes,
 * password recovery, and email verification. Each route specifies its corresponding component
 * and, where applicable, a loader function to handle authentication checks and redirects.
 */
const AuthRoutes: RouteObject = {
  path: "auth",
  Component: AuthLayout,
  children: [
    { path: "login", Component: AuthLoginPage, loader: checkAuthAndRedirect },
    {
      path: "register",
      Component: AuthRegisterPage,
      loader: checkAuthAndRedirect,
    },
    {
      path: "change",
      loader: checkAuthAndRedirect,
      children: [
        { path: "password", Component: AuthChangePasswordPage },
        {
          path: "email",
          Component: AuthChangeEmailPage,
        },
      ],
    },
    { path: "forgot-password", Component: AuthForgotPasswordPage },
    {
      path: "verify",
      Component: AuthVerifyEmailPage,
    },
  ],
};

export default AuthRoutes;
