// File: borealis-vpn/app/page.tsx
// UPDATED: This is now a dynamic page that shows different
// content based on whether the user is logged in.

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { PricingCard } from "@/components/home/PricingCard";
import { HowToUse } from "@/components/home/HowToUse";
import Link from "next/link";
import { User } from "next-auth";

// --- Logged-In Dashboard ---
// This is shown when the user *is* logged in.
function LoggedInDashboard({ user }: { user: User }) {
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Status Card */}
        <div className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold">Your Status</h2>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Plan</span>
              <span className="font-medium">{user.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="font-medium">{user.planStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Expires</span>
              <span className="font-medium">
                {user.planExpiresAt
                  ? new Date(user.planExpiresAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
          <Link href="/account" className="mt-6 block">
            <Button variant="primary" className="w-full">
              Go to My Account
            </Button>
          </Link>
        </div>
        {/* Quick Connect Card */}
        <div className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold">Quick Connect</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Download your config file to get started.
          </p>
          {/* This is a placeholder. You would add the download logic here. */}
          <Button variant="secondary" className="mt-6 w-full" disabled>
            Download Config (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Logged-Out Homepage ---
// This is shown when the user is *not* logged in.
function LoggedOutHomepage() {
  return (
    <>
      {/* Hero Section */}
      <div className="flex h-[calc(100vh-200px)] min-h-[400px] flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          Borealis VPN
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          The secure, fast, and reliable VPN for everyone.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button variant="primary" className="px-6 py-6 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* How To Use Section */}
      <HowToUse />

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <PricingCard
              title="Free"
              price="$0"
              period=""
              description="Get started for free."
              features={["1 Device Connection", "Community Support"]}
            />
            <PricingCard
              title="Monthly"
              price="$10"
              period="/ month"
              description="For regular users."
              features={[
                "5 Device Connections",
                "High-Speed Servers",
                "Email Support",
              ]}
              isFeatured={true}
            />
            <PricingCard
              title="Yearly"
              price="$100"
              period="/ year"
              description="Save $20 with our best value."
              features={[
                "5 Device Connections",
                "High-Speed Servers",
                "Priority Email Support",
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// --- Main Page Component ---
// This component fetches the session and decides which view to render.
export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    return <LoggedInDashboard user={session.user} />;
  }

  return <LoggedOutHomepage />;
}
