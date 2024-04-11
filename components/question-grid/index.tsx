import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface QuestionGridProps {
  prompt?: string;
  take?: number;
}

export async function QuestionGrid({ prompt, take = 20 }: QuestionGridProps) {
  const response = await axios.get("/api/question/grid");
  const questions = response.data;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
      <h2 className="font-semibold text-md text-left w-full mb-3">Recent Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-stretch w-full">
        {questions &&
          questions.map((question: { id: string; prompt: string; answer: string | null }) => (
            <Link
              key={question.id}
              id={question.id}
              href={`/question/${question.id}`}
              className="justify-start bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full rounded-md px-4 py-2"
            >
              <h3 className="text-md font-bold text-foreground mb-2">{question.prompt}</h3>
              {question.answer ? (
                <p className="text-sm font-medium text-foreground">{question.answer}</p>
              ) : (
                <p className="text-sm font-medium text-foreground">No answer found</p>
              )}
            </Link>
          ))}
      </div>
    </div>
  );
}
