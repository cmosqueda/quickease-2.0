/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import dayjs from "dayjs";

import { useLoaderData, useNavigate } from "react-router";
import { ArrowLeft, Info } from "lucide-react";
import type { QuizAttempt } from "@/types/types";
import { useLayoutEffect, useState, type CSSProperties } from "react";
import { getQuizPercentages } from "@/utils/quiz";

export default function LearnerQuizAttemptPage() {
  const navigate = useNavigate();

  const data = useLoaderData() as QuizAttempt;
  const [correctPercentage, setCorrectPercentage] = useState(0);
  const [wrongPercentage, setWrongPercentage] = useState(0);
  const [textPercentage, setTextPercentage] = useState("");

  const totalQuestions = data.answer_data.length;
  const correctCount = data.answer_data.reduce((acc: any, item: any) => {
    const correct = item.question.correctAnswers;
    const user = item.user_answer;
    const isCorrect =
      correct.length === user.length &&
      correct.every((val: any) => user.includes(val));
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  useLayoutEffect(() => {
    const getPercentages = async () => {
      const percentages = getQuizPercentages(data);

      setCorrectPercentage(percentages.correctPercentage);
      setWrongPercentage(percentages.wrongPercentage);
      setTextPercentage(percentages.performanceText);
    };

    getPercentages();
  }, [data]);

  const [index, setIndex] = useState(0);
  const tabs = [
    <>
      <h1 className="text-2xl font-bold text-center bg-base-100 p-4 rounded-3xl border border-base-300 shadow">
        {textPercentage}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="items-center justify-center flex flex-col gap-6 bg-base-100 p-4 rounded-3xl border border-base-300 shadow">
          <h1 className="text-2xl font-bold">Correct percentage</h1>
          <div
            className="radial-progress "
            style={
              {
                "--value": correctPercentage,
                "--size": "12rem",
              } as CSSProperties
            }
            aria-valuenow={0}
            role="progressbar"
          >
            <p className="text-2xl">{correctPercentage}%</p>
          </div>
        </div>
        <div className="items-center justify-center flex flex-col gap-6 bg-base-100 p-4 rounded-3xl border border-base-300 shadow">
          <h1 className="text-2xl font-bold">Wrong percentage</h1>
          <div
            className="radial-progress "
            style={
              { "--value": wrongPercentage, "--size": "12rem" } as CSSProperties
            }
            aria-valuenow={0}
            role="progressbar"
          >
            <p className="text-2xl">{wrongPercentage}%</p>
          </div>
        </div>
      </div>
    </>,
    <>
      <div className="flex flex-col gap-8">
        {data.answer_data.map((entry: any, index: any) => {
          const { question, user_answer } = entry;

          return (
            <div
              key={index}
              className="border border-base-content/20 rounded-lg p-4 bg-base-100 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl">
                  Question {index + 1}: {question.question}
                </h2>
              </div>
              {question.description && (
                <p className="text-base text-base-content/60">
                  {question.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option: any, oIndex: any) => {
                  const isCorrect = question.correctAnswers.includes(oIndex);
                  const isUserChoice = user_answer.includes(oIndex);

                  return (
                    <div
                      key={oIndex}
                      className={clsx(
                        "p-3 rounded-lg border",
                        isCorrect && "bg-success text-success-content",
                        isUserChoice &&
                          !isCorrect &&
                          "bg-error text-error-content",
                        !isCorrect &&
                          !isUserChoice &&
                          "border-base-content/10 text-base-content"
                      )}
                    >
                      <p>{option}</p>
                      {isUserChoice && !isCorrect && (
                        <p className="text-xs mt-1 text-error-content/70">
                          (your answer)
                        </p>
                      )}
                      {isCorrect && (
                        <p className="text-xs mt-1 text-success-content/60">
                          (correct answer)
                        </p>
                      )}
                      {isCorrect && isUserChoice && (
                        <p className="text-xs mt-1 text-success-content/60">
                          (your answer)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>,
  ]; // 0 - Percentage | 1 - Answers

  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-6">
      <div className="flex justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() =>
            navigate("/learner/library?tab=quizzes", { viewTransition: true })
          }
        />
        <div className="text-right">
          <p className="text-sm text-base-content/50">
            {dayjs(data.started_at).format("MMM DD, YYYY h:mm A")}
          </p>
          <p>
            {data.user.first_name} {data.user.last_name}
          </p>
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
          {data.quiz.title || "Untitled"}
        </h1>
        <p className="text-lg text-base-content/50">
          {data.quiz.description || "No description provided"}
        </p>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab", index == 0 ? "tab-active" : null)}
          onClick={() => setIndex(0)}
        >
          Stats
        </a>
        <a
          role="tab"
          className={clsx("tab", index == 1 ? "tab-active" : null)}
          onClick={() => setIndex(1)}
        >
          Answers
        </a>
      </div>
      {tabs[index]}
    </div>
  );
}
