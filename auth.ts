// File: borealis-vpn/auth.ts
// This is your main "Auth Engine"
// It defines how users log in (e.g., email/password)
// and what data is stored in their session.

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma"; // Corrected import
import bcrypt from "bcryptjs";
import { UserRole, UserPlan, PlanStatus } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) {
          return null; // User not found or doesn't have a password
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          return user; // Success!
        }

        return null; // Invalid password
      },
    }),
  ],
  callbacks: {
    // This adds your custom fields (like 'role' and 'plan') to the JWT
    // so it's available in the session and middleware.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
        token.planStatus = user.planStatus;
        token.planExpiresAt = user.planExpiresAt;
      }
      return token;
    },
    // This adds your custom fields to the session object,
    // so you can access them in your frontend pages.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.plan = token.plan as UserPlan;
        session.user.planStatus = token.planStatus as PlanStatus;
        session.user.planExpiresAt = token.planExpiresAt as Date | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect users to /login page
  },
});
