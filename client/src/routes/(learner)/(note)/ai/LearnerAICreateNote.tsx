/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomEditor from "@/components/Editor";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";
import FlippableCard from "@/components/(learner)/flashcard/FlippableCard"; // Imported from your flashcard code
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";

import { useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkBadges } from "@/utils/badges";
import clsx from "clsx";

import {
  ArrowLeft,
  Save,
  X,
  Sparkles,
  Notebook,
  GalleryVertical,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

const FlashcardSection = ({
  cards,
  setCards,
}: {
  cards: any[];
  setCards: any;
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardChange = (
    index: number,
    side: "front" | "back",
    value: string
  ) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [side]: value };
    setCards(updated);
  };

  const nextCard = () => {
    setCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
    setIsFlipped(false);
  };
  const prevCard = () => {
    setCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setIsFlipped(false);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
        <GalleryVertical size={48} />
        <p className="mt-4">No flashcards generated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-4 bg-base-200 p-6 rounded-3xl">
        <FlippableCard
          front={cards[cardIndex].front}
          back={cards[cardIndex].back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((prev) => !prev)}
        />
        <div className="flex flex-row items-center gap-8">
          <button
            onClick={prevCard}
            disabled={cardIndex === 0}
            className="btn btn-circle btn-ghost"
          >
            <ChevronLeft size={32} />
          </button>
          <p className="font-bold font-mono">
            {cardIndex + 1} / {cards.length}
          </p>
          <button
            onClick={nextCard}
            disabled={cardIndex === cards.length - 1}
            className="btn btn-circle btn-ghost"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Edit Flashcards</h2>
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow"
          >
            <div className="flex justify-between items-center">
              <span className="badge badge-neutral">Card {index + 1}</span>
              {cards.length > 2 && (
                <button
                  onClick={() =>
                    setCards(cards.filter((_: any, i: number) => i !== index))
                  }
                  className="btn btn-ghost btn-xs text-error"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Front (Question)</legend>
              <textarea
                className="textarea textarea-bordered resize-none w-full"
                rows={2}
                value={card.front}
                onChange={(e) =>
                  handleCardChange(index, "front", e.target.value)
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Back (Answer)</legend>
              <textarea
                className="textarea textarea-bordered resize-none w-full"
                rows={2}
                value={card.back}
                onChange={(e) =>
                  handleCardChange(index, "back", e.target.value)
                }
              />
            </fieldset>
          </div>
        ))}
        <button
          onClick={() => setCards([...cards, { front: "", back: "" }])}
          className="btn btn-neutral w-full border border-base-300 shadow"
        >
          <Plus /> Add Flashcard
        </button>
      </div>
    </div>
  );
};

const QuizSection = ({
  questions,
  setQuestions,
}: {
  questions: any[];
  setQuestions: any;
}) => {
  const handleQuestionChange = (index: number, field: string, value: any) => {
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
        (i: number) => i !== oIndex
      );
    } else {
      newQuestions[qIndex].correctAnswers.push(oIndex);
    }
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
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

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
        <FileQuestion size={48} />
        <p className="mt-4">No quiz generated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Edit Quiz Questions</h2>
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="rounded-3xl p-6 bg-base-100 flex flex-col gap-4 shadow border border-base-300"
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
            className="input input-bordered w-full font-bold"
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

          <div className="flex flex-col gap-3 mt-2">
            <p className="text-sm font-semibold opacity-70">
              Options (Check correct answers)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt: string, oIndex: number) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={q.correctAnswers.includes(oIndex)}
                    onChange={() => handleCorrectAnswerToggle(qIndex, oIndex)}
                  />
                  <input
                    type="text"
                    className={clsx(
                      "input input-sm input-bordered w-full",
                      q.correctAnswers.includes(oIndex) && "input-success"
                    )}
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
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="btn btn-neutral w-full p-4 gap-2 border border-base-300 shadow"
      >
        <Plus /> Add Question
      </button>
    </div>
  );
};

export default function LearnerAICreateNotePage() {
  const data = useLoaderData() as any;
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const noteData = data.note || data;

  // State for Tabs (0 = Note, 1 = Flashcards, 2 = Quiz)
  const [activeTab, setActiveTab] = useState(0);

  // States for NOTE
  const [html, setHTML] = useState(noteData.content || "");
  const [text, setText] = useState(""); // For generating more AI content
  const [title, setTitle] = useState(noteData.title || "Untitled Note");

  // States for RESOURCES
  const [flashcards, setFlashcards] = useState<any[]>(
    data.flashcards?.flashcards || []
  );
  const [questions, setQuestions] = useState<any[]>(
    data.quiz?.quiz_content || []
  );

  const editor = useEditor({
    editable: true,
    autofocus: false,
    extensions: _TIPTAP_EXTENSIONS,
    content: noteData.content || "",
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
      setText(editor.getText());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  if (!editor) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: any = {
        title: title,
        content: html,
        user_id: user?.id,
        is_ai_generated: true,
      };

      if (flashcards.length > 0) {
        payload.generated_flashcards = {
          title: `${title} Flashcards`,
          flashcards: flashcards,
        };
      }

      if (questions.length > 0) {
        payload.generated_quiz = {
          title: `${title} Quiz`,
          quiz_content: questions,
        };
      }

      const res = await _API_INSTANCE.post("/notes/create", payload, {
        timeout: 8 * 60 * 1000,
      });

      if (res.status == 201) {
        await checkBadges();
        let successMsg = "Note created.";
        if (flashcards.length > 0 || questions.length > 0) {
          successMsg += " Attached resources saved!";
        }
        toast.success(successMsg);
        navigate("/learner/library?tab=notes");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-base-200">
      <div className="sticky top-0 z-20 flex flex-col lg:flex-row justify-between lg:gap-0 gap-4 lg:items-center border-b border-base-300 p-4 bg-base-100/80 backdrop-blur-md">
        <div className="flex flex-row items-center gap-4">
          <ArrowLeft
            onClick={() =>
              navigate("/learner/library?tab=notes", { viewTransition: true })
            }
            className="cursor-pointer lg:ml-6"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Create note</h1>
            {(flashcards.length > 0 || questions.length > 0) && (
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <Sparkles size={12} />
                <span>Auto-generation active</span>
              </div>
            )}
          </div>
        </div>

        {(flashcards.length > 0 || questions.length > 0) && (
          <div className="join bg-base-200 p-1 rounded-full mx-auto">
            <button
              className={clsx(
                "join-item btn btn-sm rounded-full border-none",
                activeTab === 0 ? "btn-neutral" : "btn-ghost"
              )}
              onClick={() => setActiveTab(0)}
            >
              <Notebook size={14} /> Note
            </button>
            <button
              className={clsx(
                "join-item btn btn-sm rounded-full border-none",
                activeTab === 1 ? "btn-neutral" : "btn-ghost"
              )}
              onClick={() => setActiveTab(1)}
            >
              <GalleryVertical size={14} /> Flashcards ({flashcards.length})
            </button>
            <button
              className={clsx(
                "join-item btn btn-sm rounded-full border-none",
                activeTab === 2 ? "btn-neutral" : "btn-ghost"
              )}
              onClick={() => setActiveTab(2)}
            >
              <FileQuestion size={14} /> Quiz ({questions.length})
            </button>
          </div>
        )}

        <div className="flex flex-row gap-4 w-full lg:w-fit">
          <button
            className="btn btn-neutral flex flex-row gap-4 items-center flex-1 lg:flex-initial shadow-lg"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? <span className="loading loading-spinner" /> : <Save />}
            <p>Save All</p>
          </button>
          <button
            onClick={() =>
              navigate("/learner/library?tab=notes", { viewTransition: true })
            }
            className="btn btn-ghost btn-neutral flex flex-row gap-4 items-center flex-1 lg:flex-initial"
          >
            <X />
            <p>Cancel</p>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.2fr] h-full flex-1">
        <div className="flex flex-col gap-2 p-4 lg:p-8 overflow-y-auto">
          {activeTab === 0 && (
            <>
              <input
                placeholder="Title..."
                value={title}
                className="font-bold text-3xl input input-ghost w-full"
                onChange={(e) => setTitle(e.target.value)}
              />
              <CustomEditor editor={editor} />
            </>
          )}

          {activeTab === 1 && (
            <FlashcardSection cards={flashcards} setCards={setFlashcards} />
          )}

          {activeTab === 2 && (
            <QuizSection questions={questions} setQuestions={setQuestions} />
          )}
        </div>

        <div className="flex flex-col gap-4 bg-base-100 border-l border-base-300 p-4 h-full sticky top-[80px]">
          {(flashcards.length > 0 || questions.length > 0) && (
            <div className="alert alert-soft alert-success text-xs p-2">
              <span>
                Resources generated! Review them using the tabs above.
              </span>
            </div>
          )}
        </div>
      </div>

      <GenerateFlashcardModal text={text} />
      <GenerateQuizModal text={text} />
    </div>
  );
}
