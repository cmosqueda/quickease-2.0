import { BookCheck, Menu, NotebookPen, SquareStack } from "lucide-react";
import { NavLink } from "react-router";

export default function LandingPage() {
  const cardContents = [
    {
      icon: (
        <NotebookPen
          size={36}
          className="p-1 shrink-0 rounded-lg bg-gray-100"
        />
      ),
      title: "Summarize with AI",
      description: "Quickly turn long contents into key points.",
    },
    {
      icon: (
        <SquareStack
          size={36}
          className="p-1 shrink-0 rounded-lg bg-gray-100"
        />
      ),
      title: "Review with AI flashcards",
      description: "Reinforce key concepts for better learning.",
    },
    {
      icon: (
        <BookCheck size={36} className="p-1 shrink-0 rounded-lg bg-gray-100" />
      ),
      title: "Test with AI quizzes",
      description: "Challenge your knowledge with tailored questions.",
    },
  ];

  return (
    <>
      <header className="flex flex-row xl:max-w-7xl justify-between py-4 xl:px-0 px-4 xl:mx-auto items-center ">
        <h1 className="font-bold text-2xl">QuickEase</h1>
        <div className="hidden flex-row gap-4 items-center lg:flex">
          <NavLink to="/auth/login" viewTransition>
            <h1>Sign In</h1>
          </NavLink>
          <NavLink to="/auth/register" viewTransition>
            <button className="btn btn-soft">Join now</button>
          </NavLink>
          <label className="toggle text-base-content">
            <input
              type="checkbox"
              value="synthwave"
              className="theme-controller"
            />

            <svg
              aria-label="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>

            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>
        </div>
        <details className="dropdown lg:hidden dropdown-end">
          <summary className="btn m-1">
            <Menu />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NavLink to="/auth/login" viewTransition>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/register" viewTransition>
                Register
              </NavLink>
            </li>
            <label className="toggle text-base-content m-2">
              <input
                type="checkbox"
                value="synthwave"
                className="theme-controller"
              />

              <svg
                aria-label="sun"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </g>
              </svg>

              <svg
                aria-label="moon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </g>
              </svg>
            </label>
          </ul>
        </details>
      </header>
      <main className="min-h-screen bg-gray-100 flex flex-col py-4 gap-8 border-t border-gray-300 border-b">
        <div className="max-w-7xl mx-auto lg:px-0 px-2">
          <video controls={false} autoPlay muted className="w-full rounded-3xl">
            <source src="assets/videos/landing.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="flex flex-col max-w-7xl mx-auto gap-2 lg:px-0 px-2">
          <h1 className="font-black text-xl lg:text-4xl text-center">
            Supercharge your learning!
          </h1>
          <p className="text-gray-400 text-center">
            Experience the power of AI-driven learning tools designed to enhance
            your study journey.
          </p>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:px-0 px-2">
          {cardContents.map((content) => (
            <div className="flex flex-col gap-2 p-8 bg-white rounded-3xl shadow">
              <div className="flex flex-row gap-2 justify-between">
                {content.icon}
              </div>
              <h1 className="font-bold text-lg">{content.title}</h1>
              <p className="text-gray-400">{content.description}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="flex flex-col max-w-7xl mx-auto p-8 bg-white">
        <p>© 2025 QuickEase. All rights reserved.</p>
      </footer>
    </>
  );
}
