import { ORPCError, implement } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { contract } from "@momentum/api/contract";

import type { Context } from "./context";

const os = implement(contract).$context<Context>();

const publicProcedure = os;

const requireAuth = os.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

const protectedProcedure = publicProcedure.use(requireAuth);

// Mock datasets data
const mockDatasets = [
  { id: "1", name: "public.users" },
  { id: "2", name: "public.orders" },
  { id: "3", name: "public.products" },
  { id: "4", name: "public.categories" },
  { id: "5", name: "analytics.events" },
  { id: "6", name: "analytics.sessions" },
  { id: "7", name: "analytics.pageviews" },
  { id: "8", name: "inventory.stock" },
  { id: "9", name: "inventory.warehouses" },
  { id: "10", name: "sales.transactions" },
  { id: "11", name: "sales.customers" },
  { id: "12", name: "sales.invoices" },
  { id: "13", name: "hr.employees" },
  { id: "14", name: "hr.departments" },
  { id: "15", name: "hr.salaries" },
];

// Implement procedures
export const healthCheck = os.healthCheck.handler(() => {
  return "OK";
});

export const privateData = protectedProcedure.privateData.handler(({ context }) => {
  return {
    message: "This is private",
    user: context.session?.user,
  };
});

export const searchDatasets = protectedProcedure.searchDatasets.handler(async ({ input }) => {
  const { query } = input;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!query.trim()) {
    return mockDatasets.slice(0, 5);
  }

  const lowerQuery = query.toLowerCase();
  return mockDatasets.filter((dataset) => dataset.name.toLowerCase().includes(lowerQuery));
});

// Build the router
export const appRouter = os.router({
  healthCheck,
  privateData,
  searchDatasets,
});

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
