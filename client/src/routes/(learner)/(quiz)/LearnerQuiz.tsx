/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";
import formatTime from "@/utils/format_time";

import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import type { Quiz, User } from "@/types/types";

import {
  ArrowLeft,
  ArrowRightFromLine,
  Edit,
  EllipsisVertical,
  Info,
  TriangleAlertIcon,
} from "lucide-react";

interface QuizData extends Quiz {
  leaderboard: {
    id: string;
    duration: number;
    score: number;
    started_at: string;
    completed_at: string;
    user: User;
    answer_data: {
      question: {
        correctAnswers: number[];
      };
      user_answer: number[];
    }[];
  }[];
}

export default function LearnerQuizPage() {
  const navigate = useNavigate();
  const data = useLoaderData() as QuizData;
  const { user } = useAuth();

  const [tabIndex, setTabIndex] = useState(1);
  const [quizVisibility, setVisibility] = useState(data.is_public);

  const handleAnswerQuiz = async () => {
    await localStorage.setItem("QUICKEASE_CURRENT_QUIZ", JSON.stringify(data));
    navigate(`answer`);
  };

  const handleEditQuiz = async () => {
    await localStorage.setItem("QUICKEASE_CURRENT_QUIZ", JSON.stringify(data));
    navigate(`edit`);
  };

  const handleDeleteQuiz = async () => {
    try {
      const { status } = await _API_INSTANCE.delete(`/quiz/delete`, {
        data: {
          quiz_id: data.id,
        },
      });

      if (status == 200) {
        toast.success("Quiz deleted.");
        return navigate("/learner/library?tab=quizzes", {
          viewTransition: true,
        });
      }
    } catch {
      toast.error("Failed to delete.");
      return;
    }
  };

  const handleVisibility = async (visibility: boolean) => {
    try {
      const { status } = await _API_INSTANCE.put("/quiz/toggle-visibility", {
        visibility,
        quiz_id: data.id,
      });

      if (status == 200) {
        toast.success("Quiz visibility updated.");
        data.is_public = visibility;
        setVisibility(visibility);
      }
    } catch {
      toast.error("Error updating visibility.");
      return;
    }
  };

  const renderAttempts = () =>
    data.attempts.map((entry, index) => {
      const totalQuestions = entry.answer_data.length;
      const correctCount = entry.answer_data.reduce((acc: any, item: any) => {
        const { correctAnswers } = item.question;
        const userAnswers = item.user_answer;
        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans: number) => userAnswers.includes(ans));
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      return (
        <Link
          to={`attempt/${entry.id}`}
          key={entry.id}
          className="flex flex-row justify-between items-center bg-base-100 p-4 rounded-2xl border border-base-300 shadow"
        >
          <div className="flex flex-row gap-4">
            <p>{index + 1}</p>
            <img
              src={
                user?.avatar
                  ? `/assets/images/avatars/${user?.avatar}.svg`
                  : "/assets/images/avatars/blue.svg"
              }
              className={clsx(`w-[2.5rem] aspect-square`)}
            />
            <div>
              <h1 className="text-xl font-bold">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="opacity-60">
                {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <h1 className="font-bold text-xl">
              {correctCount}/{totalQuestions}
            </h1>
            <p className="opacity-60">
              Finished in {formatTime(entry.duration)}
            </p>
          </div>
        </Link>
      );
    });

  const renderLeaderboard = () =>
    data.leaderboard.map((entry, index) => {
      const totalQuestions = entry.answer_data.length;
      const correctCount = entry.answer_data.reduce((acc, item) => {
        const { correctAnswers } = item.question;
        const userAnswers = item.user_answer;
        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans) => userAnswers.includes(ans));
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      return (
        <div
          key={entry.id}
          className="flex flex-row justify-between items-center bg-base-100 p-4 rounded-2xl border border-base-300 shadow"
        >
          <div className="flex flex-row gap-4">
            <p>{index + 1}</p>
            <img
              src={
                entry.user?.avatar
                  ? `/assets/images/avatars/${entry.user?.avatar}.svg`
                  : "/assets/images/avatars/blue.svg"
              }
              className={clsx(`w-[2.5rem] aspect-square`)}
            />
            <div>
              <h1 className="text-xl font-bold">
                {entry.user.first_name} {entry.user.last_name}
              </h1>
              <p className="opacity-60">
                {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <h1 className="font-bold text-xl">
              {correctCount}/{totalQuestions}
            </h1>
            <p className="opacity-60">
              Finished in {formatTime(entry.duration)}
            </p>
          </div>
        </div>
      );
    });

  useEffect(() => {
    if (data.is_public && data.attempts.length > 0) {
      setTabIndex(0);
    }
  }, [data.is_public, data.attempts.length]);

  if (!data.is_public && data.user_id !== user?.id) {
    return (
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto w-full items-center justify-center gap-4">
        <TriangleAlertIcon size={96} />
        <div>
          <h1 className="text-4xl font-bold text-center">
            The user made this quiz private.
          </h1>
          <p className="text-base-content/50">
            Sorry, we can't display this quiz. The user either made this quiz
            private or made changes on it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1 as any, { viewTransition: true })}
        />
        <div className="flex flex-row gap-2 items-center">
          {data.user_id === user?.id && (
            <>
              <details className="dropdown dropdown-end cursor-pointer">
                <summary className="list-none">
                  <EllipsisVertical />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300 my-4 ">
                  <li>
                    <a
                      onClick={() => {
                        if (quizVisibility) {
                          handleVisibility(false);
                        } else {
                          handleVisibility(true);
                        }
                      }}
                    >
                      {quizVisibility ? "Set to private" : "Set to public"}
                    </a>
                  </li>
                  <li>
                    <a onClick={handleDeleteQuiz}>Delete</a>
                  </li>
                </ul>
              </details>
              <button className="btn btn-neutral" onClick={handleEditQuiz}>
                <Edit />
                <p>Edit</p>
              </button>
            </>
          )}
          <button className="btn btn-neutral" onClick={handleAnswerQuiz}>
            <h1>Start</h1>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>

      <div className="p-8 rounded-xl bg-base-100 border border-base-300 shadow">
        {data.is_ai_generated && (
          <div className="flex flex-row items-center gap-2">
            <Info size={16} className="text-sm text-base-content/50" />
            <h1 className="text-sm text-base-content/50">AI-generated</h1>
          </div>
        )}
        <h1 className="font-bold text-3xl lg:text-6xl">
          {data.title || "Untitled"}
        </h1>
        <p className="text-lg text-base-content/50">
          {data.description || "No description provided"}
        </p>
      </div>

      <div role="tablist" className="tabs tabs-border">
        {data.attempts.length > 0 && (
          <a
            role="tab"
            className={clsx("tab", { "tab-active": tabIndex === 0 })}
            onClick={() => setTabIndex(0)}
          >
            Your attempts
          </a>
        )}
        <a
          role="tab"
          className={clsx("tab", { "tab-active": tabIndex === 1 })}
          onClick={() => setTabIndex(1)}
        >
          Leaderboards
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {tabIndex === 0 ? renderAttempts() : renderLeaderboard()}
      </div>
    </div>
  );
}
