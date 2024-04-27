import LastUpdate from "../last-update";
import { QuestionForm } from "../question-form";

interface PageContentProps extends React.PropsWithChildren {
  prompt?: string;
}

export const PageContent = ({ prompt }: PageContentProps) => {
  return (
    <>
      <div className="w-full py-[15vh] sm:py-[20vh] flex flex-col items-center justify-center">
        <h1 className="font-medium text-4xl text-foreground mb-3 animate-in fade-in slide-in-from-bottom-3 duration-1000 ease-in-out">
          F1 Guru
        </h1>
        <LastUpdate />

        <QuestionForm initialPrompt={prompt} />
      </div>
    </>
  );
};
