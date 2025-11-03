// File: borealis-vpn/next-auth.d.ts
// This file extends the default NextAuth types to include
// your custom fields (role, plan, etc.) in the session.

import { UserRole, UserPlan, PlanStatus } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      plan: UserPlan;
      planStatus: PlanStatus;
      planExpiresAt: Date | null;
    } & DefaultSession["user"];
  }

  // Also extend the User model to match what's in your database
  interface User {
    role: UserRole;
    plan: UserPlan;
    planStatus: PlanStatus;
    planExpiresAt: Date | null;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    plan: UserPlan;
    planStatus: PlanStatus;
    planExpiresAt: Date | null;
  }
}
