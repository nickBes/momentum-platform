import { contract } from "@momentum/api/contract";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { NextResponse } from "next/server";

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export async function GET() {
  const spec = await generator.generate(contract, {
    info: {
      title: "Momentum API",
      version: "1.0.0",
      description: "API documentation for Momentum",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        description: "API Server",
      },
    ],
  });

  return NextResponse.json(spec);
}
