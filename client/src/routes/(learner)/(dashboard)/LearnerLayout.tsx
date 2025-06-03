import Sidebar from "@/components/(learner)/Sidebar";
import { useEffect } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router";
import { Toaster } from "sonner";

export default function LearnerLayout() {
  const data = useLoaderData();
  const { pathname } = useLocation();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <>
      <Toaster />
      <main className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar tab={pathname} />
        <Outlet />
      </main>
    </>
  );
}
