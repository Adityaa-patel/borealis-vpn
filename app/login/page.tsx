// File: borealis-vpn/app/login/page.tsx
// Input classNames are now in globals.css

"use client"; // This component now needs client-side state for errors

import { login } from "./actions";
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
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}

export default function LoginPage() {
  // useFormState handles the error message from the server action
  const [errorMessage, dispatch] = useFormState(login, undefined);

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Login to access your account.
        </p>
        <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <form action={dispatch} className="space-y-6">
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
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Display error message if it exists */}
            {errorMessage && (
              <div className="text-sm font-medium text-red-500">
                {errorMessage}
              </div>
            )}

            <SubmitButton />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              No account?{" "}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
