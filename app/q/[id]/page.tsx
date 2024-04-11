import { PageContent } from "@/components/page-content";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

interface QuestionProps {
  params: {
    id: string;
  };
}

const Question = async ({ params }: QuestionProps) => {
  const { id } = params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) redirect("/");

  return (
    <PageContent prompt={question.prompt}>
      <p>{question.answer}</p>
    </PageContent>
  );
};

export default Question;
