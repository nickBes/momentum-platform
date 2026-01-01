import { z } from "zod";
import type { UIMessage } from "ai";

// AI SDK UIMessagePart schemas with proper types using Zod 4 template literals

export const TextUIPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  state: z.enum(["streaming", "done"]).optional(),
});

export const ReasoningUIPartSchema = z.object({
  type: z.literal("reasoning"),
  text: z.string(),
  state: z.enum(["streaming", "done"]).optional(),
  providerMetadata: z.record(z.string(), z.any()).optional(),
});

export const SourceUrlUIPartSchema = z.object({
  type: z.literal("source-url"),
  sourceId: z.string(),
  url: z.string(),
  title: z.string().optional(),
  providerMetadata: z.record(z.string(), z.any()).optional(),
});

export const SourceDocumentUIPartSchema = z.object({
  type: z.literal("source-document"),
  sourceId: z.string(),
  mediaType: z.string(),
  title: z.string(),
  filename: z.string().optional(),
  providerMetadata: z.record(z.string(), z.any()).optional(),
});

export const FileUIPartSchema = z.object({
  type: z.literal("file"),
  mediaType: z.string(),
  filename: z.string().optional(),
  url: z.string(),
});

export const StepStartUIPartSchema = z.object({
  type: z.literal("step-start"),
});

// Tool invocation/result parts using Zod 4 template literals for proper `tool-${string}` typing
export const ToolInvocationUIPartSchema = z.object({
  type: z.literal("tool-invocation"),
  toolInvocation: z.object({
    toolCallId: z.string(),
    toolName: z.string(),
    args: z.any(),
    state: z.enum(["partial-call", "call", "result"]),
    result: z.any().optional(),
  }),
});

// Template literal for tool-${string} type pattern
const toolTypeSchema = z.templateLiteral([z.literal("tool-"), z.string()]);

export const ToolUIPartSchema = z.object({
  type: toolTypeSchema,
  toolInvocation: z.object({
    toolCallId: z.string(),
    toolName: z.string(),
    args: z.any(),
    state: z.enum(["partial-call", "call", "result"]),
    result: z.any().optional(),
  }),
});

// ============================================================================
// Custom Data Parts
// ============================================================================

// Dataset schema for selected datasets context
export const DatasetSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Dataset = z.infer<typeof DatasetSchema>;

// Custom data part for selected datasets
export const DatasetsDataPartSchema = z.object({
  type: z.literal("data-datasets"),
  data: z.object({
    datasets: z.array(DatasetSchema),
  }),
});

export type DatasetsDataPart = z.infer<typeof DatasetsDataPartSchema>;

// Union of all custom data parts (add more as needed)
export const CustomDataPartSchema = z.union([
  DatasetsDataPartSchema,
  // Add other custom data parts here
]);

// ============================================================================
// UI Message Schema
// ============================================================================

// Union of all UI message part types
export const UIMessagePartSchema = z.union([
  TextUIPartSchema,
  ReasoningUIPartSchema,
  SourceUrlUIPartSchema,
  SourceDocumentUIPartSchema,
  FileUIPartSchema,
  StepStartUIPartSchema,
  ToolInvocationUIPartSchema,
  ToolUIPartSchema,
  CustomDataPartSchema,
]);

// Custom UIMessage type with our data parts
export type CustomDataParts = {
  datasets: { datasets: Dataset[] };
};

// AI SDK UIMessage schema for chat
// Uses the full union of part schemas for proper type inference
export const UIMessageSchema: z.ZodType<UIMessage> = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(UIMessagePartSchema),
  metadata: z.any().optional(),
}) as z.ZodType<UIMessage>;

// Re-export the AI SDK's UIMessage type
export type { UIMessage } from "ai";
