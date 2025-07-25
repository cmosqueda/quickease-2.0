import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";

import { calculateScore } from "@/utils/quiz";
import {
  ArrowLeft,
  ArrowRightFromLine,
  Edit,
  EllipsisVertical,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerQuizPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const data = useLoaderData() as {
    id: string;
    user_id: string;
    quiz_content: {
      question: string;
      description?: string;
      options: string[];
      correctAnswers: number[];
    }[];
    title: string;
    description?: string;
    is_public: boolean | null;
    created_at: string;
    updated_at: string;
    is_ai_generated: boolean;
    is_randomized: boolean;
    timed_quiz: string;
    attempts: {
      id: string;
      answer_data: {
        question: {
          question: string;
          description?: string;
          options: string[];
          correctAnswers: number[];
        }[];
        user_answer: number[];
      }[];
      user_id: string;
      started_at: string;
      completed_at: string;
    }[];
    leaderboard: {
      id: string;
      duration: number;
      score: number;
      started_at: string;
      completed_at: string;
      user: {
        id: string;
        first_name: string;
        last_name: string;
      };
      answer_data: {
        question: {
          correctAnswers: number[];
        };
        user_answer: number[];
      }[];
    }[];
  };

  const [tabIndex, setTabIndex] = useState(1);

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
    } catch (err) {
      toast.error("Failed to delete.");
      return;
    }
  };

  const renderAttempts = () => (
    <div className="flex flex-row gap-4">
      {data.attempts.map((attempt, index) => (
        <NavLink
          key={attempt.id}
          to={`/learner/quizzes/${data.id}/attempt/${attempt.id}`}
          className="flex flex-col p-4 bg-base-100 rounded-3xl w-fit"
        >
          {dayjs(attempt.started_at).format("MMMM DD, YYYY")}
          <p className="font-bold text-4xl text-center">
            {calculateScore(attempt.answer_data)}/{attempt.answer_data.length}
          </p>
        </NavLink>
      ))}
    </div>
  );
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
          className="flex flex-row justify-between items-center bg-base-100 p-4 rounded-2xl"
        >
          <div className="flex flex-row gap-4">
            <p>{index + 1}</p>
            <div>
              <h1 className="text-xl font-bold">
                {entry.user.first_name} {entry.user.last_name}
              </h1>
              <p>
                {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
              </p>
            </div>
          </div>
          <h1 className="font-bold text-xl">
            {correctCount}/{totalQuestions}
          </h1>
        </div>
      );
    });

  useEffect(() => {
    if (data.attempts.length > 0) {
      setTabIndex(0);
    }
  }, [data.attempts.length]);

  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1, { viewTransition: true })}
        />
        <div className="flex flex-row gap-6 items-center">
          {data.user_id === user?.id && (
            <>
              <Edit onClick={handleEditQuiz} className="cursor-pointer" />
              <details className="dropdown dropdown-end cursor-pointer">
                <summary className="list-none">
                  <EllipsisVertical />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
                  <li>
                    <a onClick={handleDeleteQuiz}>Delete</a>
                  </li>
                </ul>
              </details>
            </>
          )}
          <button
            className="btn btn-primary btn-soft"
            onClick={handleAnswerQuiz}
          >
            <h1>Start</h1>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>

      <div>
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
