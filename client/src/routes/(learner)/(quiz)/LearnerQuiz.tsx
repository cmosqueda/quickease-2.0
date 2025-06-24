import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";

import { calculateScore } from "@/utils/quiz";
import {
  ArrowLeft,
  ArrowRightFromLine,
  Edit,
  EllipsisVertical,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import _API_INSTANCE from "@/utils/axios";

export default function LearnerQuizPage() {
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
  };
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();

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
        return navigate("/learner/library");
      }
    } catch (err) {
      toast.error("Failed to delete.");
      return;
    }
  };

  const tabs = [
    <>
      {data.attempts.map((attempt) => (
        <NavLink
          to={`/learner/quizzes/${data.id}/attempt/${attempt.id}`}
          className="flex flex-col p-4 bg-base-100 rounded-3xl w-fit"
        >
          {dayjs(attempt.started_at).format("MMMM DD, YYYY").toString()}
          <p className="font-bold text-4xl text-center">
            {calculateScore(attempt.answer_data)}/{attempt.answer_data.length}
          </p>
        </NavLink>
      ))}
    </>,
    <></>,
  ];

  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/learner/library")}
        />
        <div className="flex flex-row gap-6 items-center">
          {data.user_id == user?.id && (
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
        <h1 className="font-bold text-3xl lg:text-6xl">
          {data.title || "Untitled"}
        </h1>
        <p className="text-lg text-base-content/50">
          {data.description || "No description provided"}
        </p>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx(tabIndex == 0 ? "tab tab-active" : "tab")}
          onClick={() => setTabIndex(0)}
        >
          Your attempts
        </a>
        <a
          role="tab"
          className={clsx(tabIndex == 1 ? "tab tab-active" : "tab")}
          onClick={() => setTabIndex(1)}
        >
          Leaderboards
        </a>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
