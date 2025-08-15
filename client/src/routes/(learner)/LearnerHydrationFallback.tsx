import Sidebar from "@/components/(learner)/Sidebar";

import { LoaderPinwheel } from "lucide-react";
import { useLocation } from "react-router";

export default function LearnerHydrationFallback() {
  const { pathname } = useLocation();

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen bg-base-200">
        {pathname.startsWith("/learner/quizzes/") ? null : (
          <Sidebar tab={pathname} />
        )}
        <div className="h-screen max-w-7xl w-full flex items-center justify-center">
          <LoaderPinwheel className="animate-spin" size={128} />
        </div>
      </main>
    </>
  );
}
