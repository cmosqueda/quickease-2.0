import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CustomEditor from "@/components/Editor";
import GenerateSummaryModal from "@/components/(ai)/GenerateSummaryModal_NOTE";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";

import {
  ArrowLeft,
  BookDown,
  CalendarRange,
  ClipboardList,
  Save,
  X,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useState } from "react";

export default function LearnerCreateNotePage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  // States for editors //
  const [html, setHTML] = useState("");
  const [text, setText] = useState("");
  const [json, setJSON] = useState({});
  const [title, setTitle] = useState("");

  const editor = useEditor({
    editable: true,
    autofocus: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1],
          HTMLAttributes: {
            class: "text-4xl",
          },
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-8 list-outside",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-8 list-outside",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-base-200",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "border-t border-base-content/25",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
      setText(editor.getText());
      setJSON(editor.getJSON());
      console.log(editor.getHTML());
    },
  });
  // States for editors //

  if (!editor) return;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-0 gap-4 lg:items-center border-b border-base-300 p-4 bg-base-100">
        <div className="flex flex-row items-center gap-4">
          <ArrowLeft
            onClick={() => navigate("/learner/library")}
            className="cursor-pointer lg:ml-6"
          />
          <h1 className="text-2xl font-bold">Create note</h1>
        </div>
        <div className="flex flex-row gap-4 w-full lg:w-fit">
          <button className="btn btn-soft btn-success flex flex-row gap-4 items-center flex-1 lg:flex-initial">
            <Save />
            <p>Save changes</p>
          </button>
          <button
            onClick={() => navigate("/learner/library")}
            className="btn btn-ghost btn-neutral flex flex-row gap-4 items-center flex-1 lg:flex-initial"
          >
            <X />
            <p>Cancel</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.2fr] h-full">
        <div className="flex flex-col gap-2 p-4 lg:p-8">
          <input
            placeholder="Title..."
            value={title}
            className="font-bold text-3xl input input-ghost w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CustomEditor editor={editor} />
        </div>
        <div className="flex flex-col gap-4 bg-base-100 border-l border-b border-base-300 p-4 h-full">
          <h1 className="font-bold text-xl">Study options</h1>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() =>
              document.getElementById("generate-summary-modal").showModal()
            }
          >
            <BookDown />
            <h1>Generate summary</h1>
          </button>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() =>
              document.getElementById("generate-flashcard-modal").showModal()
            }
          >
            <CalendarRange />
            <h1>Generate flashcards</h1>
          </button>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() =>
              document.getElementById("generate-quiz-modal").showModal()
            }
          >
            <ClipboardList />
            <h1>Generate quiz</h1>
          </button>
        </div>
      </div>
      <GenerateSummaryModal html={html} text={text} json={json} />
      <GenerateFlashcardModal html={html} text={text} json={json} />
      <GenerateQuizModal html={html} text={text} json={json} />
    </div>
  );
}
