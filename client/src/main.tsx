// landing page
import LandingPage from "./routes/LandingPage";

// auths pages
import AuthLayout from "./routes/(auth)/AuthLayout";
import AuthLoginPage from "./routes/(auth)/AuthLogin";
import AuthRegisterPage from "./routes/(auth)/AuthRegister";

// learner pages
import LearnerForumPage from "./routes/(learner)/(dashboard)/LearnerForum";
import LearnerLayout from "./routes/(learner)/LearnerLayout";
import LearnerLibraryPage from "./routes/(learner)/(dashboard)/LearnerLibrary";
import LearnerNotePage from "./routes/(learner)/(note)/LearnerNote";
import LearnerSummarizePage from "./routes/(learner)/(dashboard)/LearnerSummarize";
import LearnerProfilePage from "./routes/(learner)/(profile)/LearnerProfile";

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
    Component: LearnerLayout,
    children: [
      {
        Component: LearnerForumPage,
        index: true,
      },
      {
        Component: LearnerLibraryPage,
        path: "library",
      },
      {
        Component: LearnerSummarizePage,
        path: "summarize",
      },
      {
        Component: LearnerProfilePage,
        path: "profile",
      },
      {
        path: "note/:id",
        loader: async () => {},
        Component: LearnerNotePage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
