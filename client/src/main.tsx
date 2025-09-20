/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// landing page
import LandingPage from "./routes/LandingPage";

// auths pages
import AuthLayout from "./routes/(auth)/AuthLayout";
import AuthLoginPage from "./routes/(auth)/AuthLogin";
import AuthRegisterPage from "./routes/(auth)/AuthRegister";
import AuthChangePasswordPage from "./routes/(auth)/AuthChangePassword";
import AuthChangeEmailPage from "./routes/(auth)/AuthChangeEmail";
import AuthVerifyEmailPage from "./routes/(auth)/AuthVerifyEmail";

// learner pages
import LearnerForumPage from "./routes/(learner)/(dashboard)/LearnerForum";
import LearnerLayout from "./routes/(learner)/LearnerLayout";
import LearnerLibraryPage from "./routes/(learner)/(dashboard)/LearnerLibrary";
import LearnerNotePage from "./routes/(learner)/(note)/LearnerNote";
import LearnerProfilePage from "./routes/(learner)/(profile)/LearnerProfile";
import LearnerSettingsPage from "./routes/(learner)/(settings)/LearnerSettings";
import LearnerTimerPage from "./routes/(learner)/(dashboard)/LearnerTimer";
import LearnerPostPage from "./routes/(learner)/(post)/LearnerPost";
import LearnerCreateFlashcardPage from "./routes/(learner)/(flashcard)/create/LearnerCreateFlashcard";
import LearnerFlashcardPage from "./routes/(learner)/(flashcard)/LearnerFlashcard";
import LearnerQuizPage from "./routes/(learner)/(quiz)/LearnerQuiz";
import LearnerCreateQuizPage from "./routes/(learner)/(quiz)/create/LearnerCreateQuiz";
import LearnerCreateNotePage from "./routes/(learner)/(note)/create/LearnerCreateNote";
import LearnerAnswerQuizPage from "./routes/(learner)/(quiz)/answer/LearnerAnswerQuiz";
import LearnerEditQuizPage from "./routes/(learner)/(quiz)/edit/LearnerEditQuiz";
import LearnerQuizAttemptPage from "./routes/(learner)/(quiz)/view_attempt/LearnerViewAttempt";
import LearnerAICreateNotePage from "./routes/(learner)/(note)/ai/LearnerAICreateNote";
import LearnerAIFlashcardPage from "./routes/(learner)/(flashcard)/ai/LearnerAIFlashcard";
import LearnerEditFlashcardPage from "./routes/(learner)/(flashcard)/edit/LearnerEditFlashcard";
import LearnerEditAIFlashcardPage from "./routes/(learner)/(flashcard)/ai/LearnerAIEditFlashcard";
import LearnerAIEditQuizPage from "./routes/(learner)/(quiz)/ai/LearnerAIEditQuiz";
import LearnerEditPostPage from "./routes/(learner)/(post)/edit/LearnerEditPost";
import LearnerCreatePostPage from "./routes/(learner)/(post)/create/LearnerCreatePost";
import LearnerSearchPage from "./routes/(learner)/(search)/LearnerSearch";
import LearnerViewNotePage from "./routes/(learner)/(note)/view/LearnerViewNote";
import LearnerViewFlashcardPage from "./routes/(learner)/(flashcard)/view/LearnerViewFlashcard";
import LearnerHydrationFallback from "./routes/(learner)/LearnerHydrationFallback";
import LearnerErrorFallback from "./routes/(learner)/LearnerErrorFallback";
import LearnerViewProfilePage from "./routes/(learner)/(profile)/view/LearnerViewProfile";

// admin pages
import AdminLayout from "./routes/(admin)/AdminLayout";
import AdminManageUserPage from "./routes/(admin)/(user)/AdminManageUser";
import AdminManageUsersPage from "./routes/(admin)/(dashboard)/AdminManageUsers";
import AdminManageReportsPage from "./routes/(admin)/(dashboard)/AdminManageReports";
import AdminManagePostPage from "./routes/(admin)/(post)/AdminManagePost";
import AuthForgotPasswordPage from "./routes/(auth)/AuthForgotPassword";
import AdminSearchUsersPage from "./routes/(admin)/(search)/AdminSearchUsers";
import AdminSearchReportsPage from "./routes/(admin)/(search)/AdminSearchPosts";

import _API_INSTANCE from "./utils/axios";
import useAuth from "./hooks/useAuth";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  type RouteObject,
} from "react-router";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import {
  checkAuthAndRedirect,
  loadLearnerResources,
  loadUserNotes,
} from "./utils/router";

import "../global.css";

const client = new QueryClient();

const LearnerRoutes: RouteObject = {
  path: "learner",
  Component: LearnerLayout,
  loader: loadUserNotes,
  HydrateFallback: LearnerHydrationFallback,
  children: [
    {
      index: true,
      Component: LearnerForumPage,
      loader: async () => {
        const { data: notifications } = await _API_INSTANCE.get(
          "notifications"
        );

        return notifications;
      },
    },
    {
      path: "library",
      Component: LearnerLibraryPage,
      loader: loadLearnerResources,
    },
    {
      path: "profile",
      Component: LearnerProfilePage,
      loader: async () => {
        try {
          const { data: user } = await _API_INSTANCE.get("users/");
          const { data: posts } = await _API_INSTANCE.get("forum/");

          console.log({
            user,
            posts,
          });

          return {
            user,
            posts,
          };
        } catch (err) {
          redirect(-1 as any);
        }
      },
    },
    {
      path: "search",
      children: [
        {
          path: ":query/:page?",
          Component: LearnerSearchPage,
          loader: async ({
            params,
            request,
          }: {
            params: any;
            request: any;
          }) => {
            const query = params.query;
            const page = Number(params.page ?? 1);
            const limit = 10;

            // Use searchParams to read ?sort=top
            const searchParams = new URL(request.url).searchParams;
            const sort = searchParams.get("sort") ?? "newest";

            if (!query) return redirect("/");

            try {
              const { data } = await _API_INSTANCE.get("/forum/search", {
                params: { query, page, limit, sort },
              });

              return {
                posts: data.posts,
                total: data.total,
                query,
                page,
                limit,
                sort,
              };
            } catch (err) {
              return redirect("/");
            }
          },
        },
      ],
    },
    {
      path: "profile/:id",
      Component: LearnerViewProfilePage,
      loader: async ({ params }: { params: any }) => {
        try {
          const currentUserID = await useAuth.getState().user?.id;

          console.log(currentUserID);

          if (params.id == currentUserID) {
            return redirect("/learner/profile");
          }

          const { data } = await _API_INSTANCE.get(`/users/view/${params.id}`);

          return data;
        } catch (err) {
          console.log(err);
          toast.error("Error viewing profile.");
          return redirect("/");
        }
      },
    },
    {
      path: "post",
      children: [
        {
          Component: LearnerCreatePostPage,
          index: true,
          loader: async () => {
            const data = await loadLearnerResources();

            return data;
          },
        },
        {
          path: ":id",
          Component: LearnerPostPage,
          loader: async ({ params }: { params: any }) => {
            try {
              const currentUserID = await useAuth.getState().user?.id;
              const { data } = await _API_INSTANCE.get(
                `/forum/post/${params.id}`
              );

              if (!data.is_public && data.user_id !== currentUserID) {
                return { private: true };
              }

              return data;
            } catch {
              return redirect("/learner");
            }
          },
        },
        {
          path: ":id/edit",
          Component: LearnerEditPostPage,
          index: true,
          loader: async ({ params }: { params: any }) => {
            try {
              const { status, data } = await _API_INSTANCE.get(
                `/forum/post/${params.id}`
              );

              if (status == 200) {
                if (data.user_id == useAuth.getState().user?.id) {
                  return { id: data.id };
                } else {
                  toast.error("You can't edit a post that's not yours! :)");
                  return redirect(`/learner/post/${params.id}`);
                }
              }
            } catch {
              return redirect("/learner");
            }
          },
        },
      ],
    },
    {
      path: "flashcards",
      children: [
        {
          path: "view/:id",
          Component: LearnerViewFlashcardPage,
          loader: async ({ params }: { params: any }) => {
            try {
              const currentUserID = await useAuth.getState().user?.id;
              const { data } = await _API_INSTANCE.get(
                `/flashcard/${params.id}`
              );

              if (!data.is_public && data.user_id !== currentUserID) {
                return { private: true };
              }

              if (data.user_id == currentUserID) {
                return redirect(`/learner/flashcards/${params.id}`);
              }

              return data;
            } catch {
              return redirect("/learner/library?tab=flashcard");
            }
          },
        },
        {
          path: ":id",
          Component: LearnerFlashcardPage,
          loader: async ({ params }: { params: any }) => {
            try {
              const { data } = await _API_INSTANCE.get(
                `/flashcard/${params.id}`
              );
              return data;
            } catch {
              return redirect("/learner/library?tab=flashcard");
            }
          },
        },
        {
          path: ":id/edit",
          Component: LearnerEditFlashcardPage,
          loader: async ({ params }: { params: any }) => {
            try {
              const { data } = await _API_INSTANCE.get(
                `/flashcard/${params.id}`
              );
              return data;
            } catch {
              return redirect("/learner/library?tab=flashcard");
            }
          },
        },
        {
          path: "ai",
          Component: LearnerAIFlashcardPage,
          loader: () => {
            const raw = localStorage.getItem("QUICKEASE_GENERATED_CONTENT");
            return raw ? JSON.parse(raw) : "";
          },
        },
        {
          path: "ai/edit",
          Component: LearnerEditAIFlashcardPage,
          loader: () => {
            const raw = localStorage.getItem("QUICKEASE_GENERATED_CONTENT");
            return raw ? JSON.parse(raw) : "";
          },
        },
        { path: "create", Component: LearnerCreateFlashcardPage },
      ],
    },
    {
      path: "quizzes",
      children: [
        {
          path: ":id",
          Component: LearnerQuizPage,
          loader: async ({ params }: { params: any }) => {
            try {
              const { data } = await _API_INSTANCE.get(`/quiz/${params.id}`);

              return data;
            } catch {
              toast.error("Error getting quiz data.");
              return redirect("/learner/library?tab=quizzes");
            }
          },
        },
        {
          path: ":id/answer",
          Component: LearnerAnswerQuizPage,
          loader: ({ params }: { params: any }) => {
            try {
              const raw = localStorage.getItem("QUICKEASE_CURRENT_QUIZ");
              const parsed = JSON.parse(raw!);
              return parsed?.id == params.id
                ? parsed
                : redirect("/learner/library?tab=quizzes");
            } catch {
              return redirect("/learner/library?tab=quizzes");
            }
          },
        },
        {
          path: ":id/edit",
          Component: LearnerEditQuizPage,
          loader: ({ params }: { params: any }) => {
            try {
              const raw = localStorage.getItem("QUICKEASE_CURRENT_QUIZ");
              const parsed = JSON.parse(raw!);
              return parsed?.id == params.id
                ? parsed
                : redirect("/learner/library?tab=quizzes");
            } catch {
              return redirect("/learner/library?tab=quizzes");
            }
          },
        },
        {
          path: ":id/attempt/:attempt_id",
          Component: LearnerQuizAttemptPage,
          loader: async ({ params }: { params: any }) => {
            try {
              const { data } = await _API_INSTANCE.get(
                `/quiz/attempt/${params.attempt_id}`
              );
              return data;
            } catch {
              return redirect("/learner/library?tab=quizzes");
            }
          },
        },
        { path: "create", Component: LearnerCreateQuizPage },
        {
          path: "ai",
          Component: LearnerAIEditQuizPage,
          loader: () => {
            const raw = localStorage.getItem("QUICKEASE_GENERATED_CONTENT");
            return raw ? JSON.parse(raw) : "";
          },
        },
      ],
    },
    { path: "settings", Component: LearnerSettingsPage },
    { path: "timer", Component: LearnerTimerPage },
    {
      path: "note/view/:id",
      Component: LearnerViewNotePage,
      loader: async ({ params }: { params: any }) => {
        try {
          const currentUserID = await useAuth.getState().user?.id;
          const { data } = await _API_INSTANCE.get(`/notes/${params.id}`);

          if (!data.is_public && data.user_id !== currentUserID) {
            return { private: true };
          }

          if (data.user_id == currentUserID) {
            return redirect(`/learner/note/${params.id}`);
          }

          return data;
        } catch {
          return redirect("/learner/library?tab=notes");
        }
      },
    },
    {
      path: "note/:id",
      Component: LearnerNotePage,
      loader: async ({ params }: { params: any }) => {
        try {
          const { data } = await _API_INSTANCE.get(`/notes/${params.id}`);
          return data;
        } catch {
          return redirect("/learner/library?tab=notes");
        }
      },
    },
    { path: "note/create", Component: LearnerCreateNotePage },
    {
      path: "note/create/ai",
      Component: LearnerAICreateNotePage,
      loader: () => {
        const raw = localStorage.getItem("QUICKEASE_GENERATED_CONTENT");
        return raw ? JSON.parse(raw) : "";
      },
    },
  ],
};

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

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    loader: checkAuthAndRedirect,
    ErrorBoundary: LearnerErrorFallback,
  },
  AuthRoutes,
  LearnerRoutes,
  {
    path: "admin",
    Component: AdminLayout,
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
        path: "reports/search",
        Component: AdminSearchReportsPage,
      },
      {
        path: "user/:id",
        Component: AdminManageUserPage,
        loader: async ({ params }) => {
          try {
            const { data } = await _API_INSTANCE.get(
              `admin/auth/user/${params.id}`
            );

            return data;
          } catch (err) {
            redirect(-1 as any);
          }
        },
      },
      {
        path: "users/search",
        Component: AdminSearchUsersPage,
      },
      {
        path: "report/:id",
        Component: AdminManagePostPage,
        loader: async ({ params }) => {
          try {
            const { data } = await _API_INSTANCE.get(
              `admin/forum/report/${params.id}`
            );

            return data;
          } catch (err) {
            redirect(-1 as any);
          }
        },
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <Toaster position="top-right" expand={true} />
    <RouterProvider router={router} />
  </QueryClientProvider>
);
