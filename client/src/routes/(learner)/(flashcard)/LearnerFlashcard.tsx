import { useLoaderData } from "react-router";

export default function LearnerFlashcard() {
  const data = useLoaderData();
  return (
    <div className="flex flex-col w-full min-h-screen max-w-7xl mx-auto p-8 gap-4"></div>
  );
}
