import Sidebar from "@/components/(learner)/Sidebar";
import TimerPopup from "@/components/(learner)/TimerPopup";
import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import { Clock } from "lucide-react";

import { useEffect } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router";
import { Toaster } from "sonner";

export default function LearnerLayout() {
  const data = useLoaderData();
  const { pathname } = useLocation();
  const { isPopupEnabled } = useTimer();

  return (
    <>
      <Toaster />
      <main className="flex flex-col lg:flex-row min-h-screen bg-base-200">
        <Sidebar tab={pathname} />
        <Outlet />
      </main>
      {isPopupEnabled ? <TimerPopup /> : <></>}
    </>
  );
}
