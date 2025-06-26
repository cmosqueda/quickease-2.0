import clsx from "clsx";
import dayjs from "dayjs";

import { useLoaderData, useNavigate } from "react-router";
import { ArrowLeft, Info } from "lucide-react";

export default function LearnerQuizAttemptPage() {
  const navigate = useNavigate();

  const data = useLoaderData() as {
    id: string;
    title: string;
    description: string;
    quiz_id: string;
    user_id: string;
    started_at: string;
    completed_at: string;
    is_public: boolean;
    answer_data: {
      question: {
        question: string;
        description?: string;
        options: string[];
        correctAnswers: number[];
      };
      user_answer: number[];
    }[];
    is_ai_generated: boolean;
  };

  const totalQuestions = data.answer_data.length;
  const correctCount = data.answer_data.reduce((acc, item) => {
    const correct = item.question.correctAnswers;
    const user = item.user_answer;
    const isCorrect =
      correct.length === user.length &&
      correct.every((val) => user.includes(val));
    return acc + (isCorrect ? 1 : 0);
  }, 0);

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
          <p className="font-bold text-xl">
            Score: {correctCount}/{totalQuestions}
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
          {data.title || "Untitled"}
        </h1>
        <p className="text-lg text-base-content/50">
          {data.description || "No description provided"}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {data.answer_data.map((entry, index) => {
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
                {question.options.map((option, oIndex) => {
                  const isCorrect = question.correctAnswers.includes(oIndex);
                  const isUserChoice = user_answer.includes(oIndex);

                  return (
                    <div
                      key={oIndex}
                      className={clsx(
                        "p-3 rounded-lg border",
                        isCorrect && "border-success text-success",
                        isUserChoice && !isCorrect && "border-error text-error",
                        !isCorrect &&
                          !isUserChoice &&
                          "border-base-content/10 text-base-content"
                      )}
                    >
                      <p>{option}</p>
                      {isUserChoice && (
                        <p className="text-xs mt-1 text-base-content/40">
                          (your answer)
                        </p>
                      )}
                      {isCorrect && (
                        <p className="text-xs mt-1 text-success/60">
                          (correct answer)
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
    </div>
  );
}
