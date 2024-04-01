import { QuestionCard } from "@/components/question-card";
import { PageContent } from "@/components/page-content";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { QuestionGetRequest } from "@/lib/validators/question";

export default async function Question({ params }: { params: QuestionGetRequest }) {
  const data = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!data) redirect("/");

  return (
    <PageContent prompt={data.prompt}>
      <QuestionCard id={params.id} />
    </PageContent>
  );
}
