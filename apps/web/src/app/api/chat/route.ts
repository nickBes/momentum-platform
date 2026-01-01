import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { UIMessageSchema, type CustomDataParts } from "@momentum/schemas/ai";
import { auth } from "@momentum/auth";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

// Custom UIMessage type with our data parts
type CustomUIMessage = UIMessage<never, CustomDataParts>;

const RequestBodySchema = z.object({
  messages: UIMessageSchema.array(),
});

export async function POST(request: Request) {
  // Validate LLM configuration
  const baseURL = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;

  if (!baseURL) {
    return new Response("LLM_BASE_URL is not configured", { status: 500 });
  }

  if (!model) {
    return new Response("LLM_MODEL is not configured", { status: 500 });
  }

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const parsed = RequestBodySchema.safeParse(body);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request body", details: z.prettifyError(parsed.error) }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages } = parsed.data;

  // Create OpenAI-compatible provider
  const llm = createOpenAICompatible({
    name: "openai-compatible",
    apiKey: process.env.LLM_API_KEY,
    baseURL,
  });

  // Use default system prompt
  const systemPrompt = "You are a helpful assistant.";

  try {
    const result = streamText({
      model: llm(model),
      system: systemPrompt,
      messages: await convertToModelMessages<CustomUIMessage>(messages as CustomUIMessage[], {
        convertDataPart: (part) => {
          // Convert dataset context to text for model understanding
          if (part.type === "data-datasets") {
            const datasets = part.data.datasets;
            if (datasets.length > 0) {
              return {
                type: "text",
                text: `[Context: User has selected the following datasets: ${datasets.map((d) => d.name).join(", ")}]`,
              };
            }
          }
          // Ignore other data parts
          return undefined;
        },
      }),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("LLM error:", error);
    return new Response(
      JSON.stringify({
        error: "LLM request failed",
        message: error instanceof Error ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
