import { z } from "zod";

export const ClassificationResultSchema = z.object({
  kode: z.string(),
  profesi: z.string(),
  confidence: z.number(),
  reason: z.string(),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}
