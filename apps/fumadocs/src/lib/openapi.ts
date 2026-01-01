import { createOpenAPI } from "fumadocs-openapi/server";

const apiUrl = process.env.API_URL || "http://localhost:3001";

export const openapi = createOpenAPI({
  input: [`${apiUrl}/api/openapi.json`],
});
