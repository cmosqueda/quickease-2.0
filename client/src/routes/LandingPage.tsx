import clsx from "clsx";
import ThemeGridSection from "@/components/(landing)/ThemeGridSection";

import { darkThemes, lightThemes } from "@/types/themes";
import { NavLink } from "react-router";

import {
  BookCheck,
  Menu,
  NotebookPen,
  Paintbrush,
  SquareStack,
  Users,
} from "lucide-react";

const cardContents = [
  {
    icon: NotebookPen,
    title: "Summarize with AI",
    description: "Quickly turn long contents into key points.",
  },
  {
    icon: SquareStack,
    title: "Review with AI flashcards",
    description: "Reinforce key concepts for better learning.",
  },
  {
    icon: BookCheck,
    title: "Test with AI quizzes",
    description: "Challenge your knowledge with tailored questions.",
  },
  {
    icon: Users,
    title: "Have a question?",
    description: "Ask the community/users!",
  },
];

const NavLinks = () => (
  <>
    <NavLink to="/auth/login" viewTransition>
      <h1>Sign In</h1>
    </NavLink>
    <NavLink to="/auth/register" viewTransition>
      <button className="btn btn-soft">Join now</button>
    </NavLink>
  </>
);

export default function LandingPage() {
  return (
    <>
      {/* Header */}
      <header className="flex flex-row justify-between items-center py-4 xl:px-0 px-4 xl:max-w-7xl xl:mx-auto bg-base-100">
        <h1 className="font-bold text-2xl">QuickEase</h1>

        {/* Desktop nav */}
        <div className="hidden lg:flex flex-row items-center gap-4">
          <NavLinks />
          <details
            className={clsx(
              "dropdown dropdown-end hidden lg:grid rounded-full p-1.5 shrink-0 border border-base-300 bg-base-100 transition-all duration-300 cursor-pointer hover:shadow"
            )}
          >
            <summary className="list-none">
              <Paintbrush />
            </summary>
            <ul className="dropdown-content border border-base-300 bg-base-100 p-4 rounded-box z-10 w-[52rem] shadow-sm flex flex-col gap-8">
              <ThemeGridSection themes={darkThemes} label="Dark themes" />
              <ThemeGridSection themes={lightThemes} label="Light themes" />
            </ul>
          </details>
        </div>

        {/* Mobile nav */}
        <details className="dropdown lg:hidden dropdown-end">
          <summary className="btn m-1">
            <Menu />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
            <li>
              <NavLink to="/auth/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/auth/register">Register</NavLink>
            </li>
          </ul>
        </details>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:grid lg:grid-cols-2 py-[8rem] xl:min-h-[85vh] xl:max-w-7xl lg:p-0 p-4 mx-auto items-center">
        <div className="flex flex-col gap-2 items-center lg:items-start">
          <p className="tracking-widest">SUPERCHARGE YOUR LEARNING.</p>
          <h1 className="text-6xl lg:text-7xl font-black text-center lg:text-start">
            Learning has never been easier with{" "}
            <span className="text-accent">QuickEase.</span>
          </h1>
          <p className="text-xl my-4 text-base-content/75 text-center lg:text-start">
            QuickEase is a study assistant that helps you generate flashcards
            and quizzes effortlessly.
          </p>
          <div className="flex flex-row gap-4 items-center">
            <NavLink className="btn btn-xl btn-accent" to="/auth/register">
              Join now
            </NavLink>
            <NavLink
              className="btn btn-xl btn-neutral btn-ghost"
              to="/auth/login"
            >
              Sign in
            </NavLink>
          </div>
        </div>
        <img
          className="w-full lg:block hidden"
          style={{ animation: "floatAnimation 4s ease-in-out infinite" }}
          src="/assets/images/mascot.png"
          alt="Mascot"
        />
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-4 xl:max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center">Features</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cardContents.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-base-100 p-4 rounded-xl flex flex-col gap-2"
            >
              <div className="flex flex-col">
                <Icon
                  size={36}
                  className="p-1 shrink-0 rounded-lg bg-base-100"
                />
                <h1 className="font-bold text-2xl">{title}</h1>
              </div>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section className="flex flex-col gap-4 xl:max-w-7xl mx-auto my-12">
        <h1 className="text-5xl font-bold text-center">Downloads</h1>
        <p className="text-center text-xl lg:p-0 px-4">
          Choose the correct download for your platform. For details, see the{" "}
          <NavLink to="" className="text-accent">
            installation guide
          </NavLink>
          .
        </p>
        <div className="divider" />
        <div className="flex flex-row justify-between lg:p-0 p-4">
          <div>
            <h1 className="font-bold text-4xl">Mobile</h1>
            <p className="text-xl text-base-content/50">
              QuickEase Mobile is the official Android app.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h1>Scan the QR code below.</h1>
          </div>
        </div>
      </section>
    </>
  );
}
