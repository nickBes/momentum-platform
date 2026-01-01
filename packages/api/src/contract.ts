import { oc } from "@orpc/contract";
import type { InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract";
import { z } from "zod";

// Schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
});

export const DatasetSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Contract definitions
export const healthCheckContract = oc.route({ method: "GET", path: "/health" }).output(z.string());

export const privateDataContract = oc.route({ method: "GET", path: "/private" }).output(
  z.object({
    message: z.string(),
    user: UserSchema.optional(),
  }),
);

export const searchDatasetsContract = oc
  .route({ method: "GET", path: "/datasets/search" })
  .input(z.object({ query: z.string() }))
  .output(z.array(DatasetSchema));

// Contract router
export const contract = {
  healthCheck: healthCheckContract,
  privateData: privateDataContract,
  searchDatasets: searchDatasetsContract,
};

// Type utilities
export type Contract = typeof contract;
export type ContractInputs = InferContractRouterInputs<typeof contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof contract>;
