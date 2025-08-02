import useTimer from "@/hooks/useTimer";

import { Clipboard, Clock, Coffee, LightbulbIcon, Save } from "lucide-react";
import { useState } from "react";

export default function LearnerTimerPage() {
  const { isPopupEnabled, togglePopup, setSettings } = useTimer();
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(0);

  const cards = [
    {
      icon: <Clipboard />,
      title: "Pick a task",
      description: "Decide on your task and set your mind to it.",
    },
    {
      icon: <Clock />,
      title: "Work for 25 Minutes",
      description:
        "Set your timer for 25 minutes and work without distractions.",
    },
    {
      icon: <Coffee />,
      title: "Take a 5-Minute Break",
      description:
        "After 25 minutes of work, reward yourself with a short break.",
    },
    {
      icon: <LightbulbIcon />,
      title: "Repeat & Long Break",
      description:
        "After 4 Pomodoros, take a longer break of 15-30 minutes to recharge.",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">
            Customize your sessions
          </h1>
          <p className="text-base-content/40">
            Fine-tune your work intervals and breaks to match your productivity
            rhythm.
          </p>
        </div>
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full lg:w-[16rem] border p-4">
          <legend className="fieldset-legend">
            Popup pomodoro timer options
          </legend>
          <label className="label">
            <input
              type="checkbox"
              checked={isPopupEnabled}
              onChange={togglePopup}
              className="toggle"
            />
            Enable popup
          </label>
        </fieldset>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div className="flex flex-row items-center gap-4 p-4 bg-base-100 rounded-3xl">
            {card.icon}
            <div className="flex flex-col">
              <h1 className="font-medium">{card.title}</h1>
              <p className="text-base-content/50">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        <h1 className="text-xl lg:hidden block">Settings</h1>
        <div className="flex flex-col gap-2 p-4 bg-base-100 rounded-3xl">
          <div className="flex flex-row gap-2">
            <Clock />
            <h1>Study session</h1>
          </div>
          <div className="flex flex-row gap-2">
            <fieldset className="fieldset w-full">
              <input
                type="number"
                maxLength={59}
                min={0}
                className="input w-full"
                placeholder="Type here"
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(parseInt(e.target.value))}
              />
              <p className="label">Minutes</p>
            </fieldset>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-base-100 rounded-3xl">
          <div className="flex flex-row gap-2">
            <Coffee />
            <h1>Short break session</h1>
          </div>
          <div className="flex flex-row gap-2">
            <fieldset className="fieldset w-full">
              <input
                type="number"
                maxLength={59}
                min={0}
                className="input w-full"
                placeholder="Type here"
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(parseInt(e.target.value))}
              />
              <p className="label">Minutes</p>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center justify-end">
        <button
          className="flex flex-row gap-4 items-center btn btn-primary lg:w-fit w-full"
          onClick={() => {
            setSettings(studyMinutes, shortBreakMinutes);
          }}
        >
          <Save />
          <h1>Save</h1>
        </button>
      </div>
    </div>
  );
}
