/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router";
import { toast } from "sonner";

export default function ErrorFallback() {
  const navigate = useNavigate();
  const { error }: any = useRouteError();

  useEffect(() => {
    setTimeout(() => {
      navigate(-1 as any, { viewTransition: true });
    }, 3000);
  }, []);

  const handleSubmitReport = () => {
    toast.success("Stack report submitted.");
  };

  return (
    <main className="max-w-3xl h-screen bg-base-100 flex flex-col py-8 justify-center mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-4 items-center">
          <img src="/assets/images/icon.png" className="w-[48px]" />
          <h1 className="text-4xl font-bold">QuickEase</h1>
        </div>
        <div className="flex flex-col gap-2 p-4 border border-base-200 shadow rounded-xl">
          <h1 className="text-xl font-black">Error: {error.message}</h1>
          <div className="divider my-0" />
          <p className="text-base-content/60">
            <b>Stack: </b>
            {error.stack}
          </p>
          <button className="btn btn-success" onClick={handleSubmitReport}>
            Report
          </button>
        </div>
        <p className="text-base-content/50 self-end">
          You'll be navigated to homepage in a while...
        </p>
      </div>
    </main>
  );
}
