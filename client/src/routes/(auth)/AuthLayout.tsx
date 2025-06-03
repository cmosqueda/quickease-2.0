import { Outlet, useLoaderData } from "react-router";

export default function AuthLayout() {
  const data = useLoaderData();

  return <Outlet />;
}
