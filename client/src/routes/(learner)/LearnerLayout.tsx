import Sidebar from "@/components/(learner)/Sidebar";
import TimerPopup from "@/components/(learner)/TimerPopup";
import useTimer from "@/hooks/useTimer";
import startSound from "/assets/audio/start.wav";
import endSound from "/assets/audio/end.wav";

import { Outlet, useLoaderData, useLocation } from "react-router";
import { Toaster } from "sonner";
import { useRef } from "react";

export default function LearnerLayout() {
  const data = useLoaderData();
  const { pathname } = useLocation();
  const { isPopupEnabled } = useTimer();

  const startAudioRef = useRef(null);
  const endAudioRef = useRef(null);

  return (
    <>
      <audio
        ref={startAudioRef}
        src={startSound}
        preload="auto"
        autoPlay={false}
      />
      <audio ref={endAudioRef} src={endSound} preload="auto" autoPlay={false} />
      <Toaster position="top-right" />
      <main className="flex flex-col lg:flex-row min-h-screen bg-base-200">
        <Sidebar tab={pathname} />
        <Outlet />
      </main>
      {isPopupEnabled ? <TimerPopup /> : <></>}
    </>
  );
}
