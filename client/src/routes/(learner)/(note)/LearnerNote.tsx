/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomEditor from "@/components/Editor";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";
import FlippableCard from "@/components/(learner)/flashcard/FlippableCard";
import _API_INSTANCE from "@/utils/axios";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";

import { Link, useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ArrowLeft,
  CalendarRange,
  Clipboard,
  ClipboardList,
  Delete,
  Save,
  X,
  Notebook,
  GalleryVertical,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit,
} from "lucide-react";

const FlashcardViewer = ({ cards }: { cards: any[] }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
        <p className="mt-4">No flashcards attached to this note.</p>
      </div>
    );
  }

  const actualCards = cards[0]?.flashcards || [];

  if (actualCards.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto h-full justify-center">
      <Link
        to={`/learner/flashcards/${cards[0].id}/edit`}
        className="btn w-fit btn-neutral gap-4"
      >
        <Edit />
        Edit on flashcard library
      </Link>
      <div className="flex flex-col items-center gap-4 bg-base-200 p-8 rounded-3xl">
        <FlippableCard
          front={actualCards[cardIndex].front}
          back={actualCards[cardIndex].back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((prev) => !prev)}
        />

        <div className="flex flex-row items-center gap-8 mt-4">
          <button
            onClick={prevCard}
            disabled={cardIndex === 0}
            className="btn btn-circle btn-ghost"
          >
            <ChevronLeft size={32} />
          </button>
          <p className="font-bold font-mono text-lg">
            {cardIndex + 1} / {actualCards.length}
          </p>
          <button
            onClick={nextCard}
            disabled={cardIndex === actualCards.length - 1}
            className="btn btn-circle btn-ghost"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          View All Cards List
        </div>
        <div className="collapse-content">
          <div className="flex flex-col gap-3">
            {actualCards.map((c: any, i: number) => (
              <div key={i} className="p-3 bg-base-200 rounded-lg text-sm">
                <span className="font-bold">Q:</span> {c.front} <br />
                <span className="font-bold opacity-70">A:</span> {c.back}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizViewer = ({ quizzes }: { quizzes: any[] }) => {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
        <FileQuestion size={48} />
        <p className="mt-4">No quizzes attached to this note.</p>
      </div>
    );
  }

  const questions = quizzes[0]?.quiz_content || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <Link
        to={`/learner/quizzes/${quizzes[0].id}`}
        className="btn w-fit btn-neutral gap-4"
      >
        <Edit />
        Edit on quiz library
      </Link>
      {questions.map((q: any, qIndex: number) => (
        <div
          key={qIndex}
          className="rounded-3xl p-6 bg-base-100 flex flex-col gap-4 shadow border border-base-300"
        >
          <h2 className="font-bold text-lg">
            <span className="opacity-50 mr-2">{qIndex + 1}.</span>
            {q.question}
          </h2>
          {q.description && (
            <p className="text-sm opacity-70 italic">{q.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {q.options.map((opt: string, oIndex: number) => {
              const isCorrect = q.correctAnswers.includes(oIndex);
              return (
                <div
                  key={oIndex}
                  className={clsx(
                    "p-3 rounded-xl border flex items-center gap-3 text-sm",
                    isCorrect
                      ? "bg-success/10 border-success"
                      : "bg-base-100 border-base-200"
                  )}
                >
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function LearnerNotePage() {
  const { user } = useAuth();
  const data = useLoaderData() as any;
  const navigate = useNavigate();

  // State for Tabs (0 = Note, 1 = Flashcards, 2 = Quiz)
  const [activeTab, setActiveTab] = useState(0);

  // States for editors
  const [html, setHTML] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(data.is_public);

  const hasPregeneratedContents = data.has_pregenerated_contents;
  const attachedFlashcards = data.flashcards || [];
  const attachedQuizzes = data.quizzes || [];

  const editor = useEditor({
    editable: true,
    autofocus: false,
    extensions: _TIPTAP_EXTENSIONS,
    content: data.notes_content,
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
      setText(editor.getText());
    },
  });

  useEffect(() => {
    setTitle(data.title);
    setHTML(data.notes_content);
  }, [data]);

  useEffect(() => {
    if (editor && editor.isEditable && editor.getText().trim()) {
      setText(editor.getText());
    }
  }, [editor]);

  const handleSave = async () => {
    if (title === data.title && html === data.notes_content) {
      toast.info("No changes to save.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await _API_INSTANCE.put(
        "/notes/update",
        {
          title: title,
          content: html,
          note_id: data.id,
          user_id: user?.id,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (res.status == 200) {
        toast.success("Note updated.");
        navigate("/learner/library?tab=notes");
      }
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { status } = await _API_INSTANCE.delete("/notes/delete", {
        data: { note_id: data.id },
      });
      if (status == 200) {
        toast.success("Note deleted.");
        return navigate(-1 as any);
      }
    } catch (err) {
      toast.error("Error deleting note.");
      throw err;
    }
  };

  const handleVisibility = async (visibility: boolean) => {
    try {
      await _API_INSTANCE.patch(
        "/notes/toggle-visibility",
        {
          visibility: visibility,
          note_id: data.id,
        },
        { timeout: 8 * 60 * 1000 }
      );
      toast.success("Note visibility updated.");
    } catch {
      toast.error("Error updating note visibility.");
    }
  };

  if (!editor) return null;

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
            <h1 className="text-xl font-bold truncate max-w-[200px] lg:max-w-md">
              {activeTab !== 0 ? title : title || "Note"}
            </h1>
            {hasPregeneratedContents && (
              <div className="flex items-center gap-1 text-[10px] text-primary font-medium uppercase tracking-wider">
                <Sparkles size={10} /> AI Generated
              </div>
            )}
          </div>
        </div>

        {hasPregeneratedContents && (
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
              <GalleryVertical size={14} /> Flashcards
            </button>
            <button
              className={clsx(
                "join-item btn btn-sm rounded-full border-none",
                activeTab === 2 ? "btn-neutral" : "btn-ghost"
              )}
              onClick={() => setActiveTab(2)}
            >
              <FileQuestion size={14} /> Quiz
            </button>
          </div>
        )}

        <div className="flex flex-row gap-4 w-full lg:w-fit justify-end">
          {title != data.title || html != data.notes_content ? (
            <>
              <button
                disabled={isSaving}
                onClick={handleSave}
                className="btn btn-neutral flex flex-row gap-2 items-center"
              >
                {isSaving ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
              <button
                onClick={() =>
                  navigate("/learner/library?tab=notes", {
                    viewTransition: true,
                  })
                }
                className="btn btn-ghost btn-neutral"
              >
                <X size={16} /> Cancel
              </button>
            </>
          ) : (
            <div className="hidden lg:block w-[100px]"></div>
          )}
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

          {activeTab === 1 && <FlashcardViewer cards={attachedFlashcards} />}

          {activeTab === 2 && <QuizViewer quizzes={attachedQuizzes} />}
        </div>

        <div className="flex flex-col gap-4 bg-base-100 border-l border-base-300 p-4 h-full sticky top-[80px]">
          {user?.is_verified && !hasPregeneratedContents && (
            <>
              <h1 className="font-bold text-xl">Study options</h1>
              <button
                className="rounded-3xl btn btn-soft gap-2 join-item border border-base-300 shadow justify-start"
                onClick={() => {
                  const modal = document.getElementById(
                    "generate-flashcard-modal"
                  ) as HTMLDialogElement;
                  modal.showModal();
                }}
              >
                <CalendarRange size={18} />
                <span>Generate flashcards</span>
              </button>
              <button
                className="rounded-3xl btn btn-soft gap-2 join-item border border-base-300 shadow justify-start"
                onClick={() => {
                  const modal = document.getElementById(
                    "generate-quiz-modal"
                  ) as HTMLDialogElement;
                  modal.showModal();
                }}
              >
                <ClipboardList size={18} />
                <span>Generate quiz</span>
              </button>
            </>
          )}

          <h1 className="font-bold text-xl">Other options</h1>
          <div className="flex flex-col gap-1">
            <button
              className="rounded-3xl btn btn-soft gap-2 join-item w-full border border-base-300 shadow justify-start"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://quickease.online/learner/note/view/${data.id}`
                );
                toast.success("Link copied to clipboard.");
              }}
              disabled={isPublic === false}
            >
              <Clipboard size={18} />
              <span>Share (Copy Link)</span>
            </button>
          </div>

          <button
            className="rounded-3xl btn btn-soft gap-2 join-item border border-base-300 shadow justify-start text-error"
            onClick={handleDelete}
          >
            <Delete size={18} />
            <span>Delete Note</span>
          </button>
        </div>
      </div>

      <GenerateFlashcardModal text={text} />
      <GenerateQuizModal text={text} />
    </div>
  );
}
