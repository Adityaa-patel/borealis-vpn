// File: borealis-vpn/app/signup/actions.ts
// Updated to return error messages instead of throwing

"use server";

import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Define a state for our form
export type SignupState = {
  message?: string | null;
  errors?: {};
};

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { message: "All fields are required." };
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters long." };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { message: "Email already in use." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return { message: "Database error. Please try again." };
  }

  // Redirect to login page after successful signup
  redirect("/login");
}
