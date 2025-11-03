// File: borealis-vpn/app/layout.tsx
// Updated to include the new Nav component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav"; // Import the Nav

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Borealis VPN",
  description: "Secure, Fast & Reliable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav /> {/* Add the Nav bar here */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
