/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import _API_INSTANCE from "@/utils/axios";
import { checkBadges } from "@/utils/badges";
import clsx from "clsx";

import {
  ArrowLeft,
  EllipsisVertical,
  ArrowRightFromLine,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

interface QuizQuestion {
  question: string;
  description?: string;
  options: string[];
  correctAnswers: number[];
}

interface UserAnswer {
  question: QuizQuestion;
  user_answer: number[];
}

export default function LearnerAnswerQuizPage() {
  const data = useLoaderData() as {
    title: string;
    description: string;
    is_ai_generated: boolean;
    id: string;
    quiz_content: QuizQuestion[];
  };

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState<Date>();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(
    data?.quiz_content?.map((q) => ({
      question: {
        question: q.question,
        description: q.description,
        options: q.options,
        correctAnswers: q.correctAnswers,
      },
      user_answer: [],
    })) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = data?.quiz_content?.[questionIndex];
  const navigate = useNavigate();

  const handleOptionToggle = (questionIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      const currentQ = updated[questionIdx].question;

      if (currentQ.correctAnswers.length > 1) {
        const selected = new Set(updated[questionIdx].user_answer);
        selected.has(optionIdx)
          ? selected.delete(optionIdx)
          : selected.add(optionIdx);

        updated[questionIdx] = {
          ...updated[questionIdx],
          user_answer: Array.from(selected),
        };
      } else {
        updated[questionIdx] = {
          ...updated[questionIdx],
          user_answer: [optionIdx],
        };
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    const completionTime = new Date();
    setIsSubmitting(true);
    setEndTime(completionTime);

    const duration = Math.floor(
      (completionTime.getTime() - startTime.getTime()) / 1000
    ); // in seconds

    const correctCount = userAnswers.reduce((acc, item) => {
      const correct = item.question.correctAnswers;
      const user = item.user_answer;
      const isCorrect =
        correct.length === user.length &&
        correct.every((val) => user.includes(val));
      return acc + (isCorrect ? 1 : 0);
    }, 0);

    try {
      const { status, data: attempt_data } = await _API_INSTANCE.post(
        "/quiz/submit",
        {
          answer_data: userAnswers,
          started_at: startTime,
          completed_at: completionTime.toISOString(),
          quiz_id: data.id,
          duration: duration,
          score: correctCount,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status === 200) {
        await checkBadges();

        toast(
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 items-center flex-1">
              <CheckCircle2 size={16} />
              <button
                className="btn btn-sm btn-ghost self-end"
                onClick={() =>
                  navigate(
                    `/learner/quizzes/${data.id}/attempt/${attempt_data.id}`
                  )
                }
              >
                View attempt
              </button>
            </div>
          </div>
        );
      }
    } catch (error) {
      toast.error("Error submitting quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() =>
            toast("Are you sure?", {
              action: {
                onClick: () =>
                  navigate(-1 as any, {
                    viewTransition: true,
                  }),
                label: "Abandon attempt",
              },
              duration: 3000,
            })
          }
        />
        <div className="flex flex-row gap-6 items-center">
          <details className="hidden dropdown dropdown-end cursor-pointer">
            <summary className="list-none">
              <EllipsisVertical />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
              <li>
                <a>Save progress</a>
              </li>
            </ul>
          </details>
          <button
            className="btn btn-primary btn-soft"
            onClick={() =>
              toast("Submit quiz?", {
                action: { label: "Submit", onClick: handleSubmit },
              })
            }
            disabled={isSubmitting}
          >
            <h1>Submit quiz</h1>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>
      <div className="collapse collapse-arrow border border-base-300 shadow">
        <input type="checkbox" />
        <div className="collapse-title bg-base-100">
          <h1>Quiz Details</h1>
        </div>
        <div className="collapse-content bg-base-100">
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
      </div>

      <div className="grid grid-cols-[0.3fr_1fr] gap-8">
        <div className="flex flex-row flex-wrap gap-2 h-fit">
          {data.quiz_content?.map((_, index) => (
            <div
              key={index}
              className={clsx(
                userAnswers[index].user_answer.length > 0
                  ? "bg-base-content/50"
                  : null,
                "flex flex-col items-center justify-center p-4 rounded-xl w-[3rem] h-[3rem] aspect-square hover:bg-base-content/40 cursor-pointer bg-base-100 border border-base-300 shadow"
              )}
              onClick={() => setQuestionIndex(index)}
            >
              <h1
                className={clsx(
                  userAnswers[index].user_answer.length > 0
                    ? "text-base-content"
                    : null
                )}
              >
                {index + 1}
              </h1>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {currentQuestion ? (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">
                {questionIndex + 1}. {currentQuestion.question}
              </h1>
              <p>{currentQuestion.description || "No description"}</p>
              {currentQuestion.correctAnswers.length > 1 && (
                <p className="text-xs text-base-content/50">
                  (Multiple answers)
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-base-100 my-2 border border-base-300 shadow">
                {currentQuestion.options.map((option, i) => (
                  <div className="flex flex-row gap-2 items-center" key={i}>
                    <input
                      type={
                        currentQuestion.correctAnswers.length > 1
                          ? "checkbox"
                          : "radio"
                      }
                      name={`question-${questionIndex}`}
                      className={
                        currentQuestion.correctAnswers.length > 1
                          ? "checkbox"
                          : "radio"
                      }
                      checked={userAnswers[questionIndex]?.user_answer.includes(
                        i
                      )}
                      onChange={() => handleOptionToggle(questionIndex, i)}
                    />
                    <h1>{option}</h1>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No question found</p>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center self-end">
        {questionIndex > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
          >
            <ChevronLeft />
            <p>Previous</p>
          </button>
        )}

        {questionIndex < data.quiz_content.length - 1 && (
          <button
            className="btn btn-primary"
            onClick={() =>
              setQuestionIndex((prev) =>
                Math.min(data.quiz_content.length - 1, prev + 1)
              )
            }
          >
            <ChevronRight />
            <p>Next</p>
          </button>
        )}
      </div>
    </div>
  );
}
