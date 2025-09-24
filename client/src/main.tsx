/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import LandingPage from "./routes/LandingPage";
import LearnerRoutes from "./types/learner_routes";
import AuthRoutes from "./types/auth_routes";
import AdminRoutes from "./types/admin_routes";
import ErrorFallback from "./routes/ErrorFallback";

import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { checkAuthAndRedirect } from "./utils/router";

import _API_INSTANCE from "./utils/axios";

import "../global.css";

const client = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    loader: checkAuthAndRedirect,
    ErrorBoundary: ErrorFallback,
  },
  AuthRoutes,
  LearnerRoutes,
  AdminRoutes,
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <Toaster position="top-right" expand={true} />
    <RouterProvider router={router} />
  </QueryClientProvider>
);
