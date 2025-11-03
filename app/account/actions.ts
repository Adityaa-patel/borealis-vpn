// File: borealis-vpn/app/account/actions.ts
// UPDATED: Added cancelSubscription action

"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma"; // Assuming you have a prisma client setup
import { UserPlan } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Allows a logged-in user to request a plan upgrade.
 * This sets their plan to 'MONTHLY' and status to 'PENDING'.
 */
export async function requestPlanUpgrade(formData: FormData) {
  const session = await auth();

  // 1. Authentication
  if (!session || !session.user || !session.user.id) {
    throw new Error("Not authenticated");
  }

  const requestedPlan = formData.get("plan") as UserPlan;
  if (requestedPlan !== "MONTHLY" && requestedPlan !== "YEARLY") {
    throw new Error("Invalid plan selected");
  }

  // 2. Update the user in the database
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      plan: requestedPlan, // Set the requested plan
      planStatus: "PENDING", // Set status to PENDING
    },
  });

  // 3. Revalidate the account page to show the new status
  revalidatePath("/account");
}

/**
 * (NEW) Allows a user to cancel their active or pending plan.
 * This reverts them to the FREE plan and INACTIVE status.
 */
export async function cancelSubscription() {
  const session = await auth();

  // 1. Authentication
  if (!session || !session.user || !session.user.id) {
    throw new Error("Not authenticated");
  }

  // 2. Update the user
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      plan: "FREE",
      planStatus: "INACTIVE",
      planExpiresAt: null, // Remove expiry date
    },
  });

  // 3. Revalidate the account page
  revalidatePath("/account");
}
