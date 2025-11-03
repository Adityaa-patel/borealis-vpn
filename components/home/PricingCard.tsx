// File: borealis-vpn/components/home/PricingCard.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
}

export function PricingCard({
  title,
  price,
  period = "/ month",
  description,
  features,
  isFeatured = false,
}: PricingCardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
        isFeatured ? "border-2 border-indigo-600" : ""
      }`}
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      <div className="mt-6">
        <span className="text-5xl font-bold">{price}</span>
        {period && (
          <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
            {period}
          </span>
        )}
      </div>
      <ul className="mt-6 flex-1 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/signup" className="mt-8">
        <Button
          variant={isFeatured ? "primary" : "secondary"}
          className="w-full"
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}
