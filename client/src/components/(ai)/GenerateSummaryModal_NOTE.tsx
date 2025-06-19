import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { EditorProvider } from "@tiptap/react";
import { AlertCircle, LoaderPinwheel, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function GenerateSummaryModal({
  html,
  text,
  json,
}: {
  html: string;
  text: string;
  json: object;
}) {
  const [generatedContent, setGeneratedContent] = useState("<h1>Test</h1>");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index == 0) {
      addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
          }
        },
        false
      );
    }
  }, [index]);

  const pages = [
    <>
      <div className="modal-box items-center justify-center flex flex-col gap-4 w-fit">
        <LoaderPinwheel className="animate-spin" size={64} />
        <h3 className="font-bold text-2xl text-center">Generating...</h3>
      </div>
    </>,
    <>
      <div className="modal-box lg:w-4xl lg:max-w-7xl lg:h-[70vh] lg:max-h-[70vh] bg-base-300 p-4 rounded-3xl flex flex-col gap-6">
        <div className="flex flex-row gap-4 items-center">
          <X
            className="cursor-pointer"
            onClick={() =>
              document.getElementById("generate-summary-modal").close()
            }
          />
          <h1 className="font-bold text-xl">Summary</h1>
        </div>
        <EditorProvider
          extensions={[
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
          ]}
          content={generatedContent}
          editable={false}
          editorContainerProps={{
            className:
              "h-full bg-base-200 rounded-xl border border-base-100 p-4",
          }}
        ></EditorProvider>
        <div className="flex flex-row gap-4 self-end items-center">
          <button className="btn btn-success">
            <Save />
            <p>Save</p>
          </button>
        </div>
      </div>
    </>,
    <>
      <div className="modal-box items-center justify-center flex flex-col gap-4 w-fit">
        <AlertCircle size={64} />
        <h3 className="font-bold text-2xl text-center">Failed.</h3>
      </div>
    </>,
  ]; // 0 - Loading | 1 - Generated content | 2 - Failed

  return (
    <dialog id="generate-summary-modal" className="modal">
      {pages[index]}
    </dialog>
  );
}
