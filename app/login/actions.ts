// File: borealis-vpn/app/login/actions.ts
// This is the new Server Action for the login page.

"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// This function will be called by the login form
export async function login(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // The 'signIn' function from NextAuth.js handles the logic
    await signIn("credentials", formData);
    return "Success"; // This won't be seen as it redirects
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    // If it's not an AuthError, re-throw it so Next.js handles it
    throw error;
  }
}
