// File: borealis-vpn/app/account/page.tsx
// UPDATED: Added "Cancel Subscription" button

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { requestPlanUpgrade, cancelSubscription } from "./actions"; // Import new action
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const session = await auth();

  // 1. Protect this page
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = session.user;

  // Helper to format dates
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isFreeAndInactive =
    user.plan === "FREE" && user.planStatus === "INACTIVE";
  const isPlanPending = user.planStatus === "PENDING";
  const isPlanActive = user.planStatus === "ACTIVE";

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">My Account</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Account Details Card */}
        <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b p-6 dark:border-gray-600">
            <h2 className="text-2xl font-semibold">Account Details</h2>
          </div>
          <div className="divide-y p-6 dark:divide-gray-600">
            <div className="flex justify-between py-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">Role</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {user.role}
              </span>
            </div>
            {/* Link to Admin Panel if user is ADMIN */}
            {user.role === "ADMIN" && (
              <div className="pt-4">
                <Link
                  href="/admin"
                  className="inline-block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Go to Admin Panel
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Card */}
        <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b p-6 dark:border-gray-600">
            <h2 className="text-2xl font-semibold">Subscription</h2>
          </div>
          <div className="divide-y p-6 dark:divide-gray-600">
            <div className="flex justify-between py-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Current Plan
              </span>
              <span className="font-medium">{user.plan}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Plan Status
              </span>
              {isPlanActive && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              )}
              {isPlanPending && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Pending Approval
                </span>
              )}
              {isFreeAndInactive && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex justify-between py-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Expires On
              </span>
              <span className="font-medium">
                {formatDate(user.planExpiresAt)}
              </span>
            </div>
          </div>
          <div className="border-t p-6 dark:border-gray-600">
            {/* Show upgrade buttons ONLY if the user is FREE / INACTIVE */}
            {isFreeAndInactive && (
              <form action={requestPlanUpgrade} className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request an upgrade. An admin will approve your account.
                </p>
                <Button
                  type="submit"
                  name="plan"
                  value="MONTHLY"
                  className="w-full"
                  variant="primary"
                >
                  Request Monthly Plan
                </Button>
              </form>
            )}
            {/* Show a message if plan is pending */}
            {isPlanPending && (
              <div className="space-y-4">
                <p className="text-center font-medium text-yellow-600">
                  Your request for the {user.plan} plan is pending approval.
                </p>
                <form action={cancelSubscription}>
                  <Button variant="danger" className="w-full">
                    Cancel Request
                  </Button>
                </form>
              </div>
            )}
            {/* Show a message if plan is active */}
            {isPlanActive && (
              <div className="space-y-4">
                <p className="text-center font-medium text-green-600">
                  Your {user.plan} plan is active.
                </p>
                <form action={cancelSubscription}>
                  <Button variant="danger" className="w-full">
                    Cancel Subscription
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
