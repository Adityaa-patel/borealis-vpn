// File: borealis-vpn/middleware.ts
// This file runs on every request.
// It's used to protect pages by redirecting unauthenticated users.

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { auth } from "@/auth"; // Correct import

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return; // Allow all API auth routes
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    // Redirect unauthenticated users to the login page
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
});

// FIX: Updated to use the recommended Vercel matcher to prevent 404s on pages.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};