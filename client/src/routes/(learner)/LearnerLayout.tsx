import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_GLOBAL";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_GLOBAL";
import GenerateSummaryModal from "@/components/(ai)/GenerateSummaryModal_GLOBAL";
import ReportCommentModal from "@/components/(learner)/ReportCommentModal";
import ReportPostModal from "@/components/(learner)/ReportPostModal";
import Sidebar from "@/components/(learner)/Sidebar";
import TimerPopup from "@/components/(learner)/TimerPopup";
import useTimer from "@/hooks/useTimer";

import { Outlet, useLoaderData, useLocation } from "react-router";
import { Toaster } from "sonner";

export default function LearnerLayout() {
  const data = useLoaderData();
  const { pathname } = useLocation();
  const { isPopupEnabled } = useTimer();

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen bg-base-200">
        {pathname.startsWith("/learner/quizzes/") ? null : (
          <Sidebar tab={pathname} />
        )}
        <Outlet />
      </main>
      {isPopupEnabled && !pathname.startsWith("/learner/quizzes/") ? (
        <TimerPopup />
      ) : (
        <></>
      )}
      <GenerateSummaryModal />
      <GenerateFlashcardModal notes={data.notes} />
      <GenerateQuizModal notes={data.notes} />
      <ReportPostModal />
      <ReportCommentModal />
    </>
  );
}
