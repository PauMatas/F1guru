import { QuestionValidator } from "@/lib/validators/question";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { prompt, answer } = QuestionValidator.parse(body);

    const existingPost = await prisma.question.findFirst({
      where: {
        answer: answer,
      },
    });
    if (existingPost) {
      return new Response(JSON.stringify(existingPost.id), { status: 200 });
    }

    const createdClient = await prisma.question.create({
      data: {
        prompt,
        answer,
      },
    });
    return new Response(JSON.stringify(createdClient.id), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Something went wrong", { status: 500 });
  }
}
