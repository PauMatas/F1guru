import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        prompt: true,
        answer: true,
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    if (!questions || questions.length === 0) {
      return new Response("No questions found", { status: 404 });
    }

    return new Response(JSON.stringify(questions));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Something went wrong", { status: 500 });
  }
}
