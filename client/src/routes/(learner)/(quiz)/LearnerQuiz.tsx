import {
  ArrowLeft,
  ArrowRightFromLine,
  Edit,
  EllipsisVertical,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";

export default function LearnerQuizPage() {
  const data = useLoaderData();
  const [screenIndex, setScreenIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const navigate = useNavigate();

  const screens = [
    <>
      <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
        <div className="flex flex-row justify-between items-center">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/learner/library")}
          />
          <div className="flex flex-row gap-6 items-center">
            <Edit />
            <details className="dropdown dropdown-end cursor-pointer">
              <summary className="list-none">
                <EllipsisVertical />
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
                <li>
                  <a>Delete</a>
                </li>
              </ul>
            </details>
            <button
              className="btn btn-primary btn-soft"
              onClick={() => setScreenIndex(1)}
            >
              <h1>Start</h1>
              <ArrowRightFromLine />
            </button>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-3xl lg:text-6xl">TITLE</h1>
          <p className="text-lg text-base-content/50">Description</p>
        </div>
      </div>
    </>,
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => setScreenIndex(0)}
        />
        <div className="flex flex-row gap-6 items-center">
          <details className="dropdown dropdown-end cursor-pointer">
            <summary className="list-none">
              <EllipsisVertical />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
              <li>
                <a>Save progress</a>
              </li>
            </ul>
          </details>
          <button className="btn btn-primary btn-soft">
            <h1>Submit quiz</h1>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[0.3fr_1fr]">
        <div className="flex flex-row flex-wrap gap-2">
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
                <input type="checkbox" defaultChecked className="checkbox" />
                <h1>Jhon Lloyd Viernes</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <input type="checkbox" className="checkbox" />
                <h1>Jhon Lloyd Viernes</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <input type="checkbox" className="checkbox" />
                <h1>Jhon Lloyd Viernes</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <input type="checkbox" className="checkbox" />
                <h1>Jhon Lloyd Viernes</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ]; // 0 - landing screen | 1 - quiz take screen

  return <>{screens[screenIndex]}</>;
}
