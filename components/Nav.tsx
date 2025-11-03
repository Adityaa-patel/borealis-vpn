// File: borealis-vpn/components/Nav.tsx
// UPDATED: Now shows Admin link in nav if user is admin

import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "./ui/button";

// A server component for the logout button
async function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="secondary" type="submit">
        Logout
      </Button>
    </form>
  );
}

export async function Nav() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Borealis VPN
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              {/* NEW: Admin link in nav */}
              {isAdmin && (
                 <Link href="/admin">
                    <Button variant="secondary">Admin Panel</Button>
                 </Link>
              )}
              <Link href="/account">
                <Button variant="primary">My Account</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
