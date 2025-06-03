// landing page
import LandingPage from "./routes/LandingPage";

// auths pages
import AuthLayout from "./routes/(auth)/AuthLayout";
import AuthLoginPage from "./routes/(auth)/AuthLogin";
import AuthRegisterPage from "./routes/(auth)/AuthRegister";

// learner pages
import LearnerForumPage from "./routes/(learner)/(dashboard)/LearnerForum";

import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";

import "../global.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: AuthLoginPage,
      },
      {
        path: "register",
        Component: AuthRegisterPage,
      },
    ],
  },
  {
    path: "learner",
    Component: LearnerForumPage,
    children: [],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
