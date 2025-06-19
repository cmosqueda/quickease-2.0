import { AlertCircle, LoaderPinwheel, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function GenerateQuizModal({
  html,
  text,
  json,
}: {
  html: string;
  text: string;
  json: object;
}) {
  const [generatedContent, setGeneratedContent] = useState("<h1>Test</h1>");
  const [cardIndex, setCardIndex] = useState(0);
  const [index, setIndex] = useState(1);

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
      <div className="modal-box lg:w-4xl lg:max-w-7xl lg:max-h-[75vh] justify-between bg-base-300 p-4 rounded-3xl flex flex-col gap-6">
        <div className="flex flex-row gap-4 items-center">
          <X
            className="cursor-pointer"
            onClick={() =>
              document.getElementById("generate-quiz-modal").close()
            }
          />
          <h1 className="font-bold text-xl">Summary</h1>
        </div>
        <div className="grid grid-cols-[0.3fr_1fr] overflow-y-auto">
          <div className="flex flex-row flex-wrap gap-2 items-center justify-center">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl w-[3rem] h-[3rem] aspect-square hover:bg-base-content/40 cursor-pointer bg-base-100">
              <h1>1</h1>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl w-[3rem] h-[3rem] aspect-square hover:bg-base-content/40 cursor-pointer bg-base-100">
              <h1>1</h1>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl w-[3rem] h-[3rem] aspect-square hover:bg-base-content/40 cursor-pointer bg-base-100">
              <h1>1</h1>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl w-[3rem] h-[3rem] aspect-square hover:bg-base-content/40 cursor-pointer bg-base-100">
              <h1>1</h1>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">1. What is my name?</h1>
              <p>Description</p>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-base-100 my-2">
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="checkbox"
                  />
                  <h1>Jhon Lloyd Viernes</h1>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input type="checkbox" disabled className="checkbox" />
                  <h1>Jhon Lloyd Viernes</h1>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input type="checkbox" disabled className="checkbox" />
                  <h1>Jhon Lloyd Viernes</h1>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input type="checkbox" disabled className="checkbox" />
                  <h1>Jhon Lloyd Viernes</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 self-end items-center">
          <button className="btn btn-success">
            <Save />
            <p>Save & Answer</p>
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
    <dialog id="generate-quiz-modal" className="modal">
      {pages[index]}
    </dialog>
  );
}
