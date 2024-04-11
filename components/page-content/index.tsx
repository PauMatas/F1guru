import { Suspense } from "react";
import { QuestionGrid } from "../question-grid";
import { QuestionCount } from "../question-count";
import { QuestionForm } from "../question-form";
import { Skeleton } from "../ui/skeleton";

interface PageContentProps extends React.PropsWithChildren {
  prompt?: string;
}

export const PageContent = ({ children, prompt }: PageContentProps) => {
  return (
    <>
      <div className="w-full py-[15vh] sm:py-[20vh] flex flex-col items-center justify-center">
        <h1 className="font-medium text-4xl text-foreground mb-3 animate-in fade-in slide-in-from-bottom-3 duration-1000 ease-in-out">
          F1 Guru
        </h1>
        <QuestionCount />

        <div className="max-w-md space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
          <QuestionForm initialPrompt={prompt} />
          {children}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-stretch w-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                aria-hidden
                key={index.toString()}
                id={index.toString()}
                className="h-11 px-4 py-2 rounded-md w-full"
              >
                <div className="w-full" />
              </Skeleton>
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <QuestionGrid prompt={prompt} />
      </Suspense>
    </>
  );
};
