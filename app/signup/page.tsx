// File: borealis-vpn/app/signup/page.tsx
// Input classNames are now in globals.css

"use client"; // This component now needs client-side state for errors

import { signup } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// A helper component to show a loading spinner on the button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full"
      variant="primary"
      disabled={pending}
    >
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  );
}

export default function SignupPage() {
  // useFormState handles the error message from the server action
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(signup, initialState);

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Get started with your secure connection.
        </p>
        <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <form action={dispatch} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password (min. 8 characters)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>

            {/* Display error message if it exists */}
            {state?.message && (
              <div className="text-sm font-medium text-red-500">
                {state.message}
              </div>
            )}

            <SubmitButton />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
