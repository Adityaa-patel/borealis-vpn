// File: borealis-vpn/app/api/vpn/check-auth/route.ts

import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

/**
 * This is a secure API endpoint for your VPS (VPN Server) to check
 * if a user is authorized to connect.
 *
 * It should be called by a script on your VPS.
 * Your VPS should pass its *own* secret key to prove it's your VPS.
 *
 * Example call from VPS:
 * curl -X POST https://your-app.vercel.app/api/vpn/check-auth \
 * -H "Content-Type: application/json" \
 * -H "Authorization: Bearer YOUR_VPS_SECRET_KEY" \
 * -d '{"email": "user@example.com"}'
 */

export async function POST(req: Request) {
  try {
    // 1. Authenticate the *requestor* (your VPS)
    const vpsSecret = req.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    // IMPORTANT: Add this secret to your Vercel Environment Variables
    if (!process.env.VPS_SECRET_KEY || vpsSecret !== process.env.VPS_SECRET_KEY) {
      // 401 Unauthorized - The request didn't come from your VPS
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the user's email from the request body
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 3. Check the user's status in the database
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        plan: true,
        planStatus: true,
        planExpiresAt: true,
      },
    });

    if (!user) {
      // User doesn't exist
      return NextResponse.json({ allow: false, reason: "User not found" });
    }

    // 4. The Core Business Logic
    const isPlanActive = user.planStatus === "ACTIVE";
    const isPlanExpired =
      user.planExpiresAt && user.planExpiresAt.getTime() < Date.now();

    if (isPlanActive && !isPlanExpired) {
      // SUCCESS: User is active and plan is not expired
      return NextResponse.json({ allow: true, plan: user.plan });
    }

    // 5. Handle all other cases (Expired, Pending, Inactive)
    let reason = "Plan is not active.";
    if (isPlanExpired) reason = "Plan has expired.";
    if (user.planStatus === "PENDING") reason = "Plan is pending approval.";
    if (user.planStatus === "INACTIVE") reason = "User has no active plan.";

    return NextResponse.json({ allow: false, reason: reason });

  } catch (error) {
    console.error("VPN Auth Check Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
