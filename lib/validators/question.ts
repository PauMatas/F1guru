import { z } from "zod";

export const QuestionValidator = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters long.")
    .max(140, "Prompt must be at most 140 characters long."),
  answer: z.string().optional(),
});

export type QuestionCreationRequest = z.infer<typeof QuestionValidator>;
