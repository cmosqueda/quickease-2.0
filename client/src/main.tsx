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
import LearnerSettingsPage from "./routes/(learner)/(settings)/LearnerSettings";
import LearnerTimerPage from "./routes/(learner)/(dashboard)/LearnerTimer";
import LearnerPostPage from "./routes/(learner)/(post)/LearnerPost";
import LearnerQuizzes from "./routes/(learner)/(dashboard)/LearnerQuizzes";
import LearnerQuiz from "./routes/(learner)/(quiz)/LearnerQuiz";
import LearnerCreateFlashcardPage from "./routes/(learner)/(flashcard)/LearnerCreateFlashcard";
import LearnerFlashcardPage from "./routes/(learner)/(flashcard)/LearnerFlashcard";
import LearnerFlashcardsPage from "./routes/(learner)/(dashboard)/LearnerFlashcards";

import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";

import "../global.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  // Auth
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
  // Auth

  // Learner
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
        Component: LearnerProfilePage,
        loader: async () => {},
        path: "profile/:id",
      },
      {
        Component: LearnerPostPage,
        loader: async () => {},
        path: "post/:id",
      },
      {
        path: "flashcards",
        children: [
          {
            Component: LearnerFlashcardsPage,
            loader: async () => {},
            index: true,
          },
          {
            Component: LearnerFlashcardPage,
            loader: async () => {},
            path: ":id",
          },
          {
            Component: LearnerCreateFlashcardPage,
            path: "create",
          },
        ],
      },
      {
        path: "quizzes",
        children: [
          { Component: LearnerQuizzes, index: true, loader: async () => {} },
          { Component: LearnerQuiz, path: ":id", loader: async () => {} },
        ],
      },
      {
        Component: LearnerSettingsPage,
        path: "settings",
      },
      {
        Component: LearnerTimerPage,
        path: "timer",
      },
      {
        path: "note/:id",
        loader: async () => {},
        Component: LearnerNotePage,
      },
    ],
  },
  // Learner
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
