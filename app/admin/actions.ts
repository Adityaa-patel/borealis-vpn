// File: borealis-vpn/app/admin/actions.ts
// UPDATED: Added denyUser action

"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma"; // Assuming you have a prisma client setup
import { UserPlan, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Checks if the current session belongs to an ADMIN.
 * Throws an error if not authorized.
 */
async function checkAdminAuth() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session;
}

/**
 * Fetches all users who have a 'PENDING' plan status.
 * This is a secure, server-only function.
 */
export async function getPendingUsers() {
  await checkAdminAuth();

  const users = await prisma.user.findMany({
    where: {
      planStatus: "PENDING",
    },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return users;
}

/**
 * Approves a user's plan request.
 * This is a secure server action called by the form.
 * @param formData The form data containing the userId.
 */
export async function approveUser(formData: FormData) {
  await checkAdminAuth();

  const userId = formData.get("userId") as string;
  if (!userId) {
    throw new Error("User ID is required");
  }

  // 2. Get the user's requested plan from the DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 3. Calculate expiry date
  let expiryDate = new Date();
  if (user.plan === "MONTHLY") {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else if (user.plan === "YEARLY") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    // Failsafe, shouldn't happen
    throw new Error("User has no valid plan to approve");
  }

  // 4. Update the user in the database
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      planStatus: "ACTIVE", // Set their status to active
      planExpiresAt: expiryDate, // Set their new expiry date
    },
  });

  // 5. Revalidate the admin page to refresh the list
  revalidatePath("/admin");
}

/**
 * (NEW) Denies a user's plan request.
 * This reverts them to the FREE plan and INACTIVE status.
 * @param formData The form data containing the userId.
 */
export async function denyUser(formData: FormData) {
  await checkAdminAuth();

  const userId = formData.get("userId") as string;
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Update the user
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      plan: "FREE",
      planStatus: "INACTIVE",
      planExpiresAt: null,
    },
  });

  // Revalidate the admin page
  revalidatePath("/admin");
}
