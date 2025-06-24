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
import LearnerCreateFlashcardPage from "./routes/(learner)/(flashcard)/LearnerCreateFlashcard";
import LearnerFlashcardPage from "./routes/(learner)/(flashcard)/LearnerFlashcard";
import LearnerFlashcardsPage from "./routes/(learner)/(dashboard)/LearnerFlashcards";
import LearnerQuizPage from "./routes/(learner)/(quiz)/LearnerQuiz";
import LearnerCreateQuizPage from "./routes/(learner)/(quiz)/LearnerCreateQuiz";
import LearnerCreateNotePage from "./routes/(learner)/(note)/LearnerCreateNote";
import LearnerAnswerQuizPage from "./routes/(learner)/(quiz)/LearnerAnswerQuiz";
import LearnerEditQuizPage from "./routes/(learner)/(quiz)/LearnerEditQuiz";
import LearnerQuizAttemptPage from "./routes/(learner)/(quiz)/LearnerViewAttempt";

// admin pages
import AdminLayout from "./routes/(admin)/AdminLayout";
import AdminManageUserPage from "./routes/(admin)/(user)/AdminManageUser";
import AdminManageUsersPage from "./routes/(admin)/(dashboard)/AdminManageUsers";
import AdminManageReportsPage from "./routes/(admin)/(dashboard)/AdminManageReports";
import AdminManagePostPage from "./routes/(admin)/(report)/AdminManageReport";

import _API_INSTANCE from "./utils/axios";
import useAuth from "./hooks/useAuth";

import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

import "../global.css";
import LearnerAICreateNotePage from "./routes/(learner)/(note)/LearnerAICreateNote";

const client = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    loader: async () => {
      try {
        const response = await _API_INSTANCE.get("/users", {
          withCredentials: true,
        });

        const { status, data } = response;

        if (status === 200 && data && typeof data.is_admin === "boolean") {
          const auth = useAuth.getState();
          auth.setUser(data);

          if (data.is_admin) {
            return redirect("/admin");
          } else {
            return redirect("/learner");
          }
        } else {
          console.warn("Unexpected response format or status", response);
          return null;
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          return null;
        }

        return null;
      }
    },
  },
  // Auth
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: AuthLoginPage,
        loader: async () => {
          try {
            const response = await _API_INSTANCE.get("/users", {
              withCredentials: true,
            });

            const { status, data } = response;

            if (status === 200 && data && typeof data.is_admin === "boolean") {
              const auth = useAuth.getState();
              auth.setUser(data);

              if (data.is_admin) {
                return redirect("/admin");
              } else {
                return redirect("/learner");
              }
            } else {
              console.warn("Unexpected response format or status", response);
              return null;
            }
          } catch (err) {
            if (err?.response?.status === 401) {
              return null;
            }

            return null;
          }
        },
      },
      {
        path: "register",
        Component: AuthRegisterPage,
        loader: async () => {
          try {
            const response = await _API_INSTANCE.get("/users", {
              withCredentials: true,
            });

            const { status, data } = response;

            if (status === 200 && data && typeof data.is_admin === "boolean") {
              const auth = useAuth.getState();
              auth.setUser(data);

              if (data.is_admin) {
                return redirect("/admin");
              } else {
                return redirect("/learner");
              }
            } else {
              console.warn("Unexpected response format or status", response);
              return null;
            }
          } catch (err) {
            if (err?.response?.status === 401) {
              return null;
            }

            return null;
          }
        },
      },
    ],
  },
  // Auth

  // Learner
  {
    path: "learner",
    Component: LearnerLayout,
    loader: async () => {
      try {
        const { status, data } = await _API_INSTANCE.get("/users", {
          withCredentials: true,
        });
        if (status == 200) {
          const auth = useAuth.getState();
          auth.setUser(data);

          const notes = await _API_INSTANCE.get("/notes");
          const flashcard = await _API_INSTANCE.get("/flashcard");
          const quiz = await _API_INSTANCE.get("/quiz");

          return {
            notes: notes.data,
            flashcards: flashcard.data,
            quizzes: quiz.data,
          };
        }
      } catch (err) {
        return redirect("/");
      }
    },
    children: [
      {
        Component: LearnerForumPage,
        index: true,
      },
      {
        Component: LearnerLibraryPage,
        path: "library",
        loader: async () => {
          const notes = await _API_INSTANCE.get("/notes");
          const flashcard = await _API_INSTANCE.get("/flashcard");
          const quiz = await _API_INSTANCE.get("/quiz");

          console.log(quiz);

          return {
            notes: notes.data,
            flashcards: flashcard.data,
            quizzes: quiz.data,
          };
        },
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
        loader: async ({ params }) => {
          try {
            const { data } = await _API_INSTANCE.get(
              `/forum/post/${params.id}`
            );

            return data;
          } catch (err) {
            return redirect("/learner");
          }
        },
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
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(
                  `/flashcard/${params.id}`
                );

                return data;
              } catch (err) {
                return redirect("/learner/library");
              }
            },
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
          {
            Component: LearnerQuizPage,
            path: ":id",
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(`/quiz/${params.id}`);
                console.log(data);

                return data;
              } catch (err) {
                toast.error("Error getting quiz data.");
                return redirect("/learner/library");
              }
            },
          },
          {
            Component: LearnerAnswerQuizPage,
            path: ":id/answer",
            loader: async ({ params }) => {
              try {
                const string = localStorage.getItem("QUICKEASE_CURRENT_QUIZ");
                const parsed = JSON.parse(string!);

                if (parsed.id == params.id) {
                  return parsed;
                } else {
                  toast.error("Invalid quiz ID.");
                  return redirect("/learner/library");
                }
              } catch (err) {
                toast.error("Error getting quiz data.");
                return redirect("/learner/library");
              }
            },
          },
          {
            Component: LearnerEditQuizPage,
            path: ":id/edit",
            loader: async ({ params }) => {
              try {
                const string = localStorage.getItem("QUICKEASE_CURRENT_QUIZ");
                const parsed = JSON.parse(string!);

                if (parsed.id == params.id) {
                  return parsed;
                } else {
                  toast.error("Invalid quiz ID.");
                  return redirect("/learner/library");
                }
              } catch (err) {
                toast.error("Error getting quiz data.");
                return redirect("/learner/library");
              }
            },
          },
          {
            Component: LearnerQuizAttemptPage,
            path: ":id/attempt/:attempt_id",
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(
                  `/quiz/attempt/${params.attempt_id}`
                );

                console.log(data);

                return data;
              } catch (err) {
                toast.error("Error getting quiz data.");
                return redirect("/learner/library");
              }
            },
          },
          {
            Component: LearnerCreateQuizPage,
            path: "create",
          },
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
        loader: async ({ params }) => {
          try {
            const { data } = await _API_INSTANCE.get(`/notes/${params.id}`);

            return data;
          } catch (err) {
            return redirect("/learner/library");
          }
        },
        Component: LearnerNotePage,
      },
      {
        path: "note/create",
        Component: LearnerCreateNotePage,
      },
      {
        path: "note/create/ai",
        loader: async () => {
          const generatedContent = localStorage.getItem(
            "QUICKEASE_GENERATED_CONTENT"
          );

          if (generatedContent) {
            return JSON.parse(generatedContent);
          } else {
            return "";
          }
        },
        Component: LearnerAICreateNotePage,
      },
    ],
  },
  // Learner

  // Admin
  {
    Component: AdminLayout,
    path: "admin",
    children: [
      {
        index: true,
        Component: AdminManageUsersPage,
      },
      {
        path: "reports",
        Component: AdminManageReportsPage,
      },
      {
        path: "user/:userId",
        Component: AdminManageUserPage,
        loader: async () => {},
      },
      {
        path: "report/:reportId",
        Component: AdminManagePostPage,
        loader: async () => {},
      },
    ],
  },
  // Admin
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
