import Sidebar from "@/components/(admin)/Sidebar";
import useAuth from "@/hooks/useAuth";

import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Toaster } from "sonner";

export default function AdminLayout() {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.is_admin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <>
      <Toaster position="top-right" />
      <main className="flex flex-col lg:flex-row min-h-screen bg-base-200">
        <Sidebar tab={pathname} />
        <Outlet />
      </main>
    </>
  );
}
