import { QuestionCard } from "../question-card";

interface QuestionGridProps {
  prompt?: string;
}

export async function QuestionGrid({ prompt }: QuestionGridProps) {
  const questions = await new Promise<{ id: string }[]>((resolve) => {
    resolve([
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4" },
      { id: "5" },
      { id: "6" },
      { id: "7" },
      { id: "8" },
      { id: "9" },
      { id: "10" },
    ]);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
      <h2 className="font-semibold text-md text-left w-full mb-3">
        {!!prompt ? "Related Questions" : "Recent Questions"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-stretch w-full">
        {questions.map((question) => (
          <QuestionCard key={question.id} id={question.id} />
        ))}
      </div>
    </div>
  );
}
