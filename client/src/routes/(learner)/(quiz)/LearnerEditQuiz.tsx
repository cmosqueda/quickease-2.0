/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";
import clsx from "clsx";

import { ArrowLeft, ArrowRightFromLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import { getUnitValue, handleTimeChange } from "@/utils/quiz";

interface Question {
  question: string;
  description: string;
  options: string[];
  correctAnswers: number[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  quiz_content: Question[];
  is_randomized: boolean;
  timed_quiz: number;
}

export default function LearnerEditQuizPage() {
  const navigate = useNavigate();
  const data = useLoaderData() as QuizData;

  const [questions, setQuestions] = useState<Question[]>(data.quiz_content);
  const [quizTitle, setQuizTitle] = useState(data.title);
  const [quizDescription, setQuizDescription] = useState(data.description);
  const [isTimedQuiz, setIsTimedQuiz] = useState(data.timed_quiz > 0);
  const [isRandomized, setIsRandomized] = useState(data.is_randomized);
  const [totalSeconds, setTotalSeconds] = useState(data.timed_quiz);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value as never;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerToggle = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    const currentAnswers = newQuestions[qIndex].correctAnswers;
    if (currentAnswers.includes(oIndex)) {
      newQuestions[qIndex].correctAnswers = currentAnswers.filter(
        (i) => i !== oIndex
      );
    } else {
      newQuestions[qIndex].correctAnswers.push(oIndex);
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        description: "",
        options: ["", "", "", ""],
        correctAnswers: [],
      },
    ]);
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (questions.length < 2) return false;

    for (const q of questions) {
      if (!q.question.trim()) return false;
      if (q.options.some((opt) => !opt.trim())) return false;
      if (q.correctAnswers.length === 0) return false;
    }

    setIsSubmitting(true);

    try {
      const { status } = await _API_INSTANCE.put(`/quiz/update`, {
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        quiz_content: questions,
        is_randomized: isRandomized,
        timed_quiz: isTimedQuiz ? totalSeconds : 0,
        quiz_id: data.id,
      });

      if (status === 200) {
        toast.success("Quiz updated.");
        return navigate('/learner/library?tab=quizzes', { viewTransition: true });
      }
    } catch (err) {
      toast.error("Error updating quiz.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full mb-16 lg:mb-24 max-w-7xl mx-auto p-8 gap-6">
      <div className="flex justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate('/learner/library?tab=quizzes', { viewTransition: true })}
        />
        <button
          className="btn btn-primary flex gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <p>{isSubmitting ? "Saving..." : "Save Changes"}</p>
          <ArrowRightFromLine />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Quiz Title"
            className="input input-bordered text-3xl font-bold w-full"
          />
          <textarea
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            placeholder="Quiz Description"
            className="textarea textarea-bordered text-base resize-none w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Quiz options</h1>
          <div className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={isRandomized}
              onChange={() => setIsRandomized((prev) => !prev)}
            />
            <h1>Randomize questions</h1>
          </div>
          <div className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={isTimedQuiz}
              onChange={() => setIsTimedQuiz(!isTimedQuiz)}
            />
            <h1>Timed quiz</h1>
          </div>
          <div className="flex flex-row gap-2">
            {["hours", "minutes", "seconds"].map((unit) => (
              <fieldset className="fieldset" key={unit}>
                <input
                  type="number"
                  className={clsx(
                    isTimedQuiz ? "opacity-100" : "opacity-0",
                    "input"
                  )}
                  value={getUnitValue(unit, totalSeconds)}
                  onChange={(e) =>
                    handleTimeChange(
                      unit,
                      e.target.value,
                      totalSeconds,
                      setTotalSeconds
                    )
                  }
                  disabled={!isTimedQuiz}
                />
                <p
                  className={clsx(
                    isTimedQuiz ? "opacity-100" : "opacity-0",
                    "label"
                  )}
                >
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}/s
                </p>
              </fieldset>
            ))}
          </div>
        </div>
      </div>

      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="border border-base-content/20 rounded-lg p-4 bg-base-100 flex flex-col gap-4 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl">Question {qIndex + 1}</h2>
            <button
              onClick={() => deleteQuestion(qIndex)}
              className="btn btn-ghost btn-sm text-error"
            >
              <Trash2 />
            </button>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(qIndex, "question", e.target.value)
            }
          />
          <textarea
            className="textarea textarea-bordered w-full resize-none"
            placeholder="Description (optional)"
            value={q.description}
            onChange={(e) =>
              handleQuestionChange(qIndex, "description", e.target.value)
            }
          />
          <div className="grid grid-cols-2 gap-4">
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={q.correctAnswers.includes(oIndex)}
                  onChange={() => handleCorrectAnswerToggle(qIndex, oIndex)}
                />
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="btn btn-accent mt-4 flex items-center gap-2 w-fit self-end"
      >
        <Plus />
        Add Question
      </button>
    </div>
  );
}
