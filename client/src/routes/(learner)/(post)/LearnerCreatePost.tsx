/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomEditor from "@/components/Editor";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";

import { useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import {
  ArrowLeft,
  Check,
  FileQuestion,
  GalleryVertical,
  Notebook,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerCreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const data = useLoaderData();

  const [tabIndex, setTabIndex] = useState(0);

  const editor = useEditor({
    editable: true,
    autofocus: true,
    extensions: _TIPTAP_EXTENSIONS,
    content: "",
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
    },
  });

  const [html, setHTML] = useState("");
  const [title, setTitle] = useState("");
  const [selectedNotes, setSelectedNotes] = useState<any[]>([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState<any[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Title is required.");
      return;
    }

    if (!html.trim()) {
      toast.warning("Post content is empty.");
      return;
    }

    setIsSaving(true);

    try {
      const attachments = [
        ...selectedNotes.map((n) => ({
          resource_type: "NOTE" as const,
          resource_id: n.id,
        })),
        ...selectedFlashcards.map((f) => ({
          resource_type: "FLASHCARD" as const,
          resource_id: f.id,
        })),
        ...selectedQuizzes.map((q) => ({
          resource_type: "QUIZ" as const,
          resource_id: q.id,
        })),
      ];

      const { status, data } = await _API_INSTANCE.post(
        "/forum/post/create",
        {
          body: html,
          title,
          attachments,
          tags: selectedTags,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status === 200) {
        queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
        toast.success("Post created successfully.");
        navigate(`/learner/post/${data.id}`);
      } else if (status === 400 && data.toxic) {
        toast.error(data.message);
      } else {
        toast.error("Failed to create post. Try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    <>
      <div className="flex flex-row items-center gap-4">
        <ArrowLeft
          onClick={() => navigate("/learner", { viewTransition: true })}
          className="cursor-pointer"
        />
        <h1 className="text-2xl font-bold">Create post</h1>
      </div>

      {/* Title Field */}
      <fieldset className="fieldset">
        <input
          type="text"
          className="input w-full input-lg"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSaving}
        />
        <p className="label text-sm">Required</p>
      </fieldset>

      <fieldset className="fieldset">
        <h1>Tags</h1>
        <input
          type="text"
          className="input w-full"
          placeholder="Add a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            const key = e.key;
            const value = tagInput.trim();

            if ((key === "Enter" || key === ",") && value) {
              e.preventDefault();

              if (!selectedTags.includes(value)) {
                setSelectedTags([...selectedTags, value]);
              }

              setTagInput("");
            }
          }}
          disabled={isSaving}
        />
        <p className="label text-sm">Optional: tags (e.g., SQL, JavaScript)</p>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <span key={tag} className="badge badge-neutral gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTags(selectedTags.filter((t) => t !== tag))
                  }
                  className="ml-1 cursor-pointer"
                >
                  <X />
                </button>
              </span>
            ))}
          </div>
        )}
      </fieldset>

      {/* Rich Text Editor */}
      <CustomEditor editor={editor!} style="overflow-y-auto" />
      <div className="flex flex-row gap-4 items-center">
        <button
          className="btn btn-neutral btn-ghost flex-1"
          onClick={() => setTabIndex(1)}
        >
          <Notebook />
          <p>Attach notes</p>
        </button>
        <button
          className="btn btn-neutral btn-ghost flex-1"
          onClick={() => setTabIndex(2)}
        >
          <GalleryVertical />
          <p>Attach flashcards</p>
        </button>
        <button
          className="btn btn-neutral btn-ghost flex-1"
          onClick={() => setTabIndex(3)}
        >
          <FileQuestion />
          <p>Attach quizzes</p>
        </button>
      </div>

      {(selectedNotes.length > 0 ||
        selectedFlashcards.length > 0 ||
        selectedQuizzes.length > 0) && (
        <div className="flex flex-row items-center gap-4 overflow-x-auto">
          {selectedNotes.map((n) => (
            <div className="flex flex-row gap-4 items-center bg-base-300 rounded-3xl p-4 h-[5rem] w-[12rem] overflow-clip">
              <Notebook className="shrink-0" />
              {n.title}
            </div>
          ))}
          {selectedFlashcards.map((f) => (
            <div className="flex flex-row gap-4 items-center bg-base-300 rounded-3xl p-4 h-[5rem] w-[12rem] overflow-clip">
              <GalleryVertical className="shrink-0" />
              {f.title}
            </div>
          ))}
          {selectedQuizzes.map((q) => (
            <div className="flex flex-row gap-4 items-center bg-base-300 rounded-3xl p-4 h-[5rem] w-[12rem] overflow-clip">
              <FileQuestion className="shrink-0" />
              {q.title}
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        className="btn btn-success mt-2"
        disabled={isSaving}
        onClick={handleSave}
      >
        {isSaving ? <span className="loading loading-spinner" /> : <p>Post</p>}
      </button>
    </>,
    <>
      {/* Header */}
      <div className="flex flex-row items-center gap-4">
        <button
          type="button"
          onClick={() => setTabIndex(0)}
          className="p-1 rounded"
          aria-label="Close modal"
        >
          <ArrowLeft className="cursor-pointer" />
        </button>
        <div>
          <h1 className="font-bold text-xl">Attach notes</h1>
          <p className="text-sm text-base-content/50">
            Only public notes are visible
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-2 gap-4">
        {data &&
          data.notes &&
          data.notes
            .filter((n: any) => n.is_public == true)
            .map((note: any) => {
              const isSelected = selectedNotes.some((n) => n.id === note.id);
              return (
                <button
                  key={note.id}
                  className="flex flex-row p-4 rounded-xl cursor-pointer bg-base-300 relative"
                  onClick={() => {
                    setSelectedNotes((prev) =>
                      isSelected
                        ? prev.filter((n) => n.id !== note.id)
                        : [...prev, note]
                    );
                  }}
                >
                  {isSelected && (
                    <Check size={16} className="absolute right-4" />
                  )}
                  <h1 className="font-bold text-2xl">{note.title}</h1>
                </button>
              );
            })}
      </div>
    </>,
    <>
      {/* Header */}
      <div className="flex flex-row items-center gap-4">
        <button
          type="button"
          onClick={() => setTabIndex(0)}
          className="p-1 rounded"
          aria-label="Close modal"
        >
          <ArrowLeft className="cursor-pointer" />
        </button>
        <div>
          <h1 className="font-bold text-xl">Attach flashcards</h1>
          <p className="text-sm text-base-content/50">
            Only public flashcards are visible
          </p>
        </div>
      </div>

      {/* Flashcards */}
      <div className="grid grid-cols-2 gap-4">
        {data &&
          data.flashcards &&
          data.flashcards
            .filter((f: any) => f.is_public == true)
            .map((flashcard: any) => {
              const isSelected = selectedFlashcards.some(
                (f) => f.id === flashcard.id
              );
              return (
                <button
                  key={flashcard.id}
                  className="flex flex-row p-4 rounded-xl cursor-pointer bg-base-300 relative"
                  onClick={() => {
                    setSelectedFlashcards((prev) =>
                      isSelected
                        ? prev.filter((f) => f.id !== flashcard.id)
                        : [...prev, flashcard]
                    );
                  }}
                >
                  {isSelected && (
                    <Check size={16} className="absolute right-4" />
                  )}
                  <h1 className="font-bold text-2xl">{flashcard.title}</h1>
                </button>
              );
            })}
      </div>
    </>,
    <>
      {/* Header */}
      <div className="flex flex-row items-center gap-4">
        <button
          type="button"
          onClick={() => setTabIndex(0)}
          className="p-1 rounded"
          aria-label="Close modal"
        >
          <ArrowLeft className="cursor-pointer" />
        </button>
        <div>
          <h1 className="font-bold text-xl">Attach quizzes</h1>
          <p className="text-sm text-base-content/50">
            Only public quizzes are visible
          </p>
        </div>
      </div>

      {/* Quizzes */}
      <div className="grid grid-cols-2 gap-4">
        {data &&
          data.quizzes &&
          data.quizzes
            .filter((q: any) => q.is_public == true)
            .map((quiz: any) => {
              const isSelected = selectedQuizzes.some((q) => q.id === quiz.id);
              return (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setSelectedQuizzes((prev) =>
                      isSelected
                        ? prev.filter((q) => q.id !== quiz.id)
                        : [...prev, quiz]
                    );
                  }}
                  className="flex flex-row p-4 rounded-xl cursor-pointer bg-base-300 relative"
                >
                  {isSelected && (
                    <Check size={16} className="absolute right-4" />
                  )}
                  <h1 className="font-bold text-2xl">{quiz.title}</h1>
                </button>
              );
            })}
      </div>
    </>,
  ]; // 0 - Post | 1 - Notes | 2 - Flashcards | 3 - Quizzes

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-h-screen max-w-7xl mx-auto">
      {tabs[tabIndex]}
    </div>
  );
}
