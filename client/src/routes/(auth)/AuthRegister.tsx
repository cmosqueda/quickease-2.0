import TermsAndPrivacyPolicyModal from "../../components/TermsAndPrivacyPolicyModal";
import _API_INSTANCE from "@/utils/axios";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";
import { toast } from "sonner";

export default function AuthRegisterPage() {
  const navigate = useNavigate();

  // forms
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);

  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email({ message: "Email required." }),
    password: z.string(),
    confirmPassword: z.string(),
    isTermsAccepted: z.boolean(),
  });

  const handleRegister = async () => {
    setIsRegistering(true);
    const result = schema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isTermsAccepted,
    });

    if (confirmPassword != password) {
      toast.error("Error: Double-check your password.");
      setIsRegistering(false);
      return;
    }

    if (!isTermsAccepted) {
      toast.error("You must agree to the terms & conditions.");
      setIsRegistering(false);
      return;
    }

    if (!result.success) {
      result.error.errors.map((m) => {
        toast.error(`Error: ${m.message.toString()}`);
      });
      setIsRegistering(false);
      return;
    }

    try {
      const response = await _API_INSTANCE.post(
        "/auth/register",
        {
          firstName,
          lastName,
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status == 201) {
        navigate("/learner", { viewTransition: true });
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response.data.message || "Error registering, please try again."
      );
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="lg:grid lg:grid-cols-2 flex flex-col gap-8 bg-base">
      <img
        className="w-full h-full lg:block hidden"
        style={{ animation: "floatAnimation 4s ease-in-out infinite" }}
        src="/assets/images/mascot.png"
      />
      <h1 className="font-bold text-3xl my-8 block lg:hidden text-center">
        QuickEase
      </h1>
      <div className="flex flex-col gap-4 justify-center p-8 2xl:px-[12rem]">
        <div className="">
          <h1 className="font-bold text-4xl">Create your account </h1>
          <p className="text-gray-400">Start your learning journey today.</p>
        </div>
        <div className="lg:grid lg:grid-cols-2 flex flex-col gap-2">
          <label className="floating-label">
            <span>First Name</span>
            <input
              type="text"
              placeholder="First Name"
              className="input input-md w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span>Last Name</span>
            <input
              type="text"
              placeholder="Last Name"
              className="input input-md w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <label className="floating-label">
          <span>Email</span>
          <input
            type="text"
            placeholder="Email"
            className="input input-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="floating-label">
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            className="input input-md w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="floating-label">
          <span>Confirm Password</span>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-md w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <label className="label">
          <input
            type="checkbox"
            value={isTermsAccepted}
            onChange={() => setIsTermsAccepted((prev) => !prev)}
            className="checkbox"
          />
          I accept the{" "}
          <button
            className="text--500 cursor-pointer"
            onClick={() =>
              document.getElementById("terms-of-use-modal").showModal()
            }
          >
            terms of use and privacy policy
          </button>
        </label>
        <button
          className="btn btn-soft btn-success btn-lg"
          disabled={isRegistering}
          onClick={handleRegister}
        >
          Create account
        </button>
        <p>
          Already have an account?{" "}
          <NavLink className={"text-accent"} to="/auth/login" viewTransition>
            Sign in
          </NavLink>
        </p>
      </div>
      <TermsAndPrivacyPolicyModal />
    </main>
  );
}
