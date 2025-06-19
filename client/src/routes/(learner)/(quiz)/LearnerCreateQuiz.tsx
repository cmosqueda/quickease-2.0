import { ArrowLeft, ArrowRightFromLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Question {
  question: string;
  description: string;
  options: string[];
  correctAnswers: number[];
}

export default function LearnerCreateQuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      description: "",
      options: ["", "", "", ""],
      correctAnswers: [],
    },
  ]);
  const [quizTitle, setQuizTitle] = useState("Untitled Quiz");
  const [quizDescription, setQuizDescription] = useState("");
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [time, setTime] = useState("");

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
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

  const handleSubmit = () => {
  };

  return (
    <div className="flex flex-col w-full mb-16 lg:mb-24 max-w-7xl mx-auto p-8 gap-6">
      <div className="flex justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/learner/library")} // or another route
        />
        <button className="btn btn-primary flex gap-2" onClick={handleSubmit}>
          <span>Save Quiz</span>
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
            <input type="checkbox" className="checkbox" />
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
            <fieldset className="fieldset">
              <input
                type="number"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!isTimedQuiz}
              />
              <p className="label">Hour/s</p>
            </fieldset>
            <fieldset className="fieldset">
              <input
                type="number"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!isTimedQuiz}
              />
              <p className="label">Minute/s</p>
            </fieldset>
            <fieldset className="fieldset">
              <input
                type="number"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!isTimedQuiz}
              />
              <p className="label">Second/s</p>
            </fieldset>
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
