// File: borealis-vpn/components/ui/button.tsx
// UPDATED: Added success and danger variants
"use client";

import React from "react";

// Define the props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", className, ...props }, ref) => {
    // Define styles for each variant
    const baseStyle =
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-offset-gray-900";

    const variants = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
      success:
        "bg-green-600 text-white hover:bg-green-700",
      danger:
        "bg-red-600 text-white hover:bg-red-700",
    };

    return (
      <button
        className={`${baseStyle} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
