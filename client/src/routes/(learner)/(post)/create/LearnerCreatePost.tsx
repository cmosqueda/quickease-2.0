/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomEditor from "@/components/Editor";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import { ResourceSelector } from "@/components/(learner)/forum/post/ResourceSelector";

import { useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import { checkBadges } from "@/utils/badges";

import {
  ArrowLeft,
  FileQuestion,
  GalleryVertical,
  Notebook,
  X,
} from "lucide-react";

export default function LearnerCreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const data = useLoaderData() as any;

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

  // Resources State
  const [selectedNotes, setSelectedNotes] = useState<any[]>([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState<any[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<any[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleNoteSelection = (action: React.SetStateAction<any[]>) => {
    let newNotes: any[] = [];

    if (typeof action === "function") {
      newNotes = action(selectedNotes);
    } else {
      newNotes = action;
    }

    const addedNotes = newNotes.filter(
      (n) => !selectedNotes.some((prev) => prev.id === n.id)
    );

    const removedNotes = selectedNotes.filter(
      (n) => !newNotes.some((curr) => curr.id === n.id)
    );

    if (addedNotes.length > 0) {
      const notesWithConnections = addedNotes.filter(
        (n) => n.has_pregenerated_contents
      );

      if (notesWithConnections.length > 0) {
        const newFlashcards = [...selectedFlashcards];
        const newQuizzes = [...selectedQuizzes];
        let autoSelectedCount = 0;

        notesWithConnections.forEach((note) => {
          const connectedFlashcard = data?.flashcards?.find(
            (f: any) => f.connected_note_id === note.id
          );
          const connectedQuiz = data?.quizzes?.find(
            (q: any) => q.connected_note_id === note.id
          );

          if (
            connectedFlashcard &&
            !newFlashcards.some((f) => f.id === connectedFlashcard.id)
          ) {
            newFlashcards.push(connectedFlashcard);
            autoSelectedCount++;
          }
          if (
            connectedQuiz &&
            !newQuizzes.some((q) => q.id === connectedQuiz.id)
          ) {
            newQuizzes.push(connectedQuiz);
            autoSelectedCount++;
          }
        });

        if (autoSelectedCount > 0) {
          setSelectedFlashcards(newFlashcards);
          setSelectedQuizzes(newQuizzes);
          toast.success("Connected Flashcards and Quizzes auto-selected!", {});
        }
      }
    }

    if (removedNotes.length > 0) {
      const removedIds = removedNotes.map((n) => n.id);

      setSelectedFlashcards((prev) =>
        prev.filter((f) => !removedIds.includes(f.connected_note_id))
      );
      setSelectedQuizzes((prev) =>
        prev.filter((q) => !removedIds.includes(q.connected_note_id))
      );
    }

    setSelectedNotes(newNotes);
  };

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

      const { status, data: resData } = await _API_INSTANCE.post(
        "/forum/post/create",
        {
          body: html,
          title,
          attachments,
          tags: selectedTags,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (status === 200) {
        await checkBadges();
        queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
        toast.success("Post created successfully.");
        navigate(`/learner/post/${resData.id}`);
      } else if (status === 400 && resData.toxic) {
        toast.error(resData.message);
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

  const renderSelectedItem = (
    item: any,
    type: "note" | "flashcard" | "quiz",
    Icon: any
  ) => {
    const isAutoSelected =
      type !== "note" &&
      selectedNotes.some((n) => n.id === item.connected_note_id);

    return (
      <div
        key={item.id}
        className={`flex-1 flex flex-row gap-4 items-center rounded-3xl p-4 xl:max-h-[5rem] xl:max-w-[16rem] overflow-hidden border shadow relative group
            ${
              isAutoSelected
                ? "bg-primary/10 border-primary/50"
                : "bg-base-300 border-base-300"
            }
            `}
      >
        <Icon className={`shrink-0 ${isAutoSelected ? "text-primary" : ""}`} />

        <span className="truncate flex-1">{item.title}</span>

        {isAutoSelected && (
          <div
            className="tooltip tooltip-left z-10"
            data-tip="Auto-selected via connected note"
          ></div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (type === "note")
              handleNoteSelection((prev: any[]) =>
                prev.filter((i) => i.id !== item.id)
              );
            if (type === "flashcard")
              setSelectedFlashcards((prev) =>
                prev.filter((i) => i.id !== item.id)
              );
            if (type === "quiz")
              setSelectedQuizzes((prev) =>
                prev.filter((i) => i.id !== item.id)
              );
          }}
          className="btn btn-circle btn-xs btn-ghost absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={12} />
        </button>
      </div>
    );
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

      <fieldset className="fieldset">
        <input
          type="text"
          className="input w-full input-lg border border-base-300 shadow"
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
          className="input w-full border border-base-300 shadow"
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

      <CustomEditor
        editor={editor!}
        style="overflow-y-auto border border-base-300 shadow"
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <button
          className="btn btn-neutral btn-ghost flex-1 p-4 lg:p-0"
          onClick={() => setTabIndex(1)}
        >
          <Notebook />
          <p>Attach notes ({selectedNotes.length})</p>
        </button>
        <button
          className="btn btn-neutral btn-ghost flex-1 p-4 lg:p-0"
          onClick={() => setTabIndex(2)}
        >
          <GalleryVertical />
          <p>Attach flashcards ({selectedFlashcards.length})</p>
        </button>
        <button
          className="btn btn-neutral btn-ghost flex-1 p-4 lg:p-0"
          onClick={() => setTabIndex(3)}
        >
          <FileQuestion />
          <p>Attach quizzes ({selectedQuizzes.length})</p>
        </button>
      </div>

      {(selectedNotes.length > 0 ||
        selectedFlashcards.length > 0 ||
        selectedQuizzes.length > 0) && (
        <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-5 gap-3">
          {selectedNotes.map((n) => renderSelectedItem(n, "note", Notebook))}
          {selectedFlashcards.map((f) =>
            renderSelectedItem(f, "flashcard", GalleryVertical)
          )}
          {selectedQuizzes.map((q) =>
            renderSelectedItem(q, "quiz", FileQuestion)
          )}
        </div>
      )}

      <button
        className="btn btn-neutral border border-base-300 shadow"
        disabled={isSaving}
        onClick={handleSave}
      >
        {isSaving ? <span className="loading loading-spinner" /> : <p>Post</p>}
      </button>
    </>,

    <ResourceSelector
      key="notes"
      title="Attach notes"
      postTitle={title}
      items={data?.notes || []}
      selectedItems={selectedNotes}
      setSelectedItems={handleNoteSelection}
      onBack={() => setTabIndex(0)}
      Icon={Notebook}
    />,

    <ResourceSelector
      key="flashcards"
      title="Attach flashcards"
      postTitle={title}
      items={data?.flashcards || []}
      selectedItems={selectedFlashcards}
      setSelectedItems={setSelectedFlashcards}
      onBack={() => setTabIndex(0)}
      Icon={GalleryVertical}
    />,

    <ResourceSelector
      key="quizzes"
      title="Attach quizzes"
      postTitle={title}
      items={data?.quizzes || []}
      selectedItems={selectedQuizzes}
      setSelectedItems={setSelectedQuizzes}
      onBack={() => setTabIndex(0)}
      Icon={FileQuestion}
    />,
  ];

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full lg:max-h-[150vh] max-w-7xl mx-auto">
      {tabs[tabIndex]}
    </div>
  );
}
