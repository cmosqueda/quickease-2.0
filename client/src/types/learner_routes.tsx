/* eslint-disable @typescript-eslint/no-explicit-any */

import useAuth from "@/hooks/useAuth";
import LearnerForumPage from "@/routes/(learner)/(dashboard)/LearnerForum";
import LearnerLibraryPage from "@/routes/(learner)/(dashboard)/LearnerLibrary";
import LearnerTimerPage from "@/routes/(learner)/(dashboard)/LearnerTimer";
import LearnerEditAIFlashcardPage from "@/routes/(learner)/(flashcard)/ai/LearnerAIEditFlashcard";
import LearnerAIFlashcardPage from "@/routes/(learner)/(flashcard)/ai/LearnerAIFlashcard";
import LearnerCreateFlashcardPage from "@/routes/(learner)/(flashcard)/create/LearnerCreateFlashcard";
import LearnerEditFlashcardPage from "@/routes/(learner)/(flashcard)/edit/LearnerEditFlashcard";
import LearnerFlashcardPage from "@/routes/(learner)/(flashcard)/LearnerFlashcard";
import LearnerViewFlashcardPage from "@/routes/(learner)/(flashcard)/view/LearnerViewFlashcard";
import LearnerAICreateNotePage from "@/routes/(learner)/(note)/ai/LearnerAICreateNote";
import LearnerCreateNotePage from "@/routes/(learner)/(note)/create/LearnerCreateNote";
import LearnerNotePage from "@/routes/(learner)/(note)/LearnerNote";
import LearnerViewNotePage from "@/routes/(learner)/(note)/view/LearnerViewNote";
import LearnerCreatePostPage from "@/routes/(learner)/(post)/create/LearnerCreatePost";
import LearnerEditPostPage from "@/routes/(learner)/(post)/edit/LearnerEditPost";
import LearnerPostPage from "@/routes/(learner)/(post)/LearnerPost";
import LearnerProfilePage from "@/routes/(learner)/(profile)/LearnerProfile";
import LearnerViewProfilePage from "@/routes/(learner)/(profile)/view/LearnerViewProfile";
import LearnerAIEditQuizPage from "@/routes/(learner)/(quiz)/ai/LearnerAIEditQuiz";
import LearnerAnswerQuizPage from "@/routes/(learner)/(quiz)/answer/LearnerAnswerQuiz";
import LearnerCreateQuizPage from "@/routes/(learner)/(quiz)/create/LearnerCreateQuiz";
import LearnerEditQuizPage from "@/routes/(learner)/(quiz)/edit/LearnerEditQuiz";
import LearnerQuizPage from "@/routes/(learner)/(quiz)/LearnerQuiz";
import LearnerQuizAttemptPage from "@/routes/(learner)/(quiz)/view_attempt/LearnerViewAttempt";
import LearnerSearchPage from "@/routes/(learner)/(search)/LearnerSearch";
import LearnerSettingsPage from "@/routes/(learner)/(settings)/LearnerSettings";
import LearnerHydrationFallback from "@/routes/(learner)/LearnerHydrationFallback";
import LearnerLayout from "@/routes/(learner)/LearnerLayout";
import _API_INSTANCE from "@/utils/axios";

import { redirect } from "react-router";
import { toast } from "sonner";
import { loadUserNotes, loadLearnerResources } from "@/utils/router";

import type { RouteObject } from "react-router";

/**
 * Defines the route configuration for the learner section of the application.
 *
 * @remarks
 * This route object includes all learner-related pages, such as forum, library, profile, search, posts, flashcards, quizzes, settings, timer, and notes.
 * Each child route specifies its own path, component, and optional loader for data fetching and redirection logic.
 *
 *
 */
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
        } catch {
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
            } catch {
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

export default LearnerRoutes;
