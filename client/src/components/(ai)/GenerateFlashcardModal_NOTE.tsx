import FlippableCard from "../(learner)/FlippableCard";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LoaderPinwheel,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function GenerateFlashcardModal({
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
      <div className="modal-box lg:w-4xl lg:max-w-7xl lg:h-[75vh] lg:max-h-[75vh] justify-between bg-base-300 p-4 rounded-3xl flex flex-col gap-6">
        <div className="flex flex-row gap-4 items-center">
          <X
            className="cursor-pointer"
            onClick={() =>
              document.getElementById("generate-flashcard-modal").close()
            }
          />
          <h1 className="font-bold text-xl">Summary</h1>
        </div>
        <div>
          <FlippableCard back="Jhon Lloyd Viernes" front="What is my name?" />
          <div className="flex flex-row items-center justify-center gap-12">
            <ChevronLeft
              className="cursor-pointer p-1.5 delay-0 duration-300 transition-all hover:bg-base-100 rounded-full hover:shadow"
              size={36}
            />
            <p>1/24</p>
            <ChevronRight
              className="cursor-pointer p-1.5 delay-0 duration-300 transition-all hover:bg-base-100 rounded-full hover:shadow"
              size={36}
            />
          </div>
        </div>
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
    <dialog id="generate-flashcard-modal" className="modal">
      {pages[index]}
    </dialog>
  );
}
