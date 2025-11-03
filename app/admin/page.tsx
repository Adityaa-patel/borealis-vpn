// File: borealis-vpn/app/admin/page.tsx
// UPDATED: Added "Deny" button

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { approveUser, denyUser, getPendingUsers } from "./actions"; // Import new action
import { Button } from "@/components/ui/button";

// This is a server-side component, so we can fetch data directly
export default async function AdminPage() {
  const session = await auth();

  // 1. Protect this page
  // If no session, or if the user is not an ADMIN, kick them out
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/account");
  }

  // 2. Fetch pending users
  const pendingUsers = await getPendingUsers();

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Admin Panel</h1>

      <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b p-6 dark:border-gray-600">
          <h2 className="text-2xl font-semibold">Pending Approvals</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Approve or deny users who have requested a plan upgrade.
          </p>
        </div>
        <div className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full divide-y dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Requested Plan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-600">
                {pendingUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No pending requests.
                    </td>
                  </tr>
                )}
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* UPDATED: Added Deny button */}
                      <div className="flex justify-end gap-2">
                        <form action={denyUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button type="submit" variant="danger">
                            Deny
                          </Button>
                        </form>
                        <form action={approveUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button type="submit" variant="success">
                            Approve
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
