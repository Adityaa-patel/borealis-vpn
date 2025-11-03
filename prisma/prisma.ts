// File: borealis-vpn/prisma/prisma.ts
// UPDATED to use Neon Serverless Driver Adapter

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

// This allows Neon to work in a Node.js environment
neonConfig.webSocketConstructor = ws;

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.POSTGRES_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}