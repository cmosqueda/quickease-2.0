import { Outlet, useLoaderData } from "react-router";
import { Toaster } from "sonner";

export default function AuthLayout() {
  const data = useLoaderData();

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}
