import { z } from "zod";

export const QuestionValidator = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters long.")
    .max(140, "Prompt must be at most 140 characters long."),
  answer: z.string().nullable(),
});

export const QuestionGetValidator = z.object({
  id: z.string(),
});

export type QuestionCreationRequest = z.infer<typeof QuestionValidator>;

export type QuestionGetRequest = z.infer<typeof QuestionGetValidator>;
