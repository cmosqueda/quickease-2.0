import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function AuthLayout() {
  return (
    <>
      <Toaster position="top-right" />
      <Outlet />
    </>
  );
}
