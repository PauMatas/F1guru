"use client";

import { useRef } from "react";
import { SubmitButton } from "./submit-button";

interface QuestionFormProps {
  initialPrompt?: string;
}

export function QuestionForm({ initialPrompt }: QuestionFormProps) {
  const submitRef = useRef<React.ElementRef<"button">>(null);

  return (
    <form action={undefined} className="bg-primary rounded-xl shadow-lg h-fit flex flex-row px-1 items-center w-full">
      <input
        defaultValue={initialPrompt}
        type="text"
        name="prompt"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submitRef.current?.click();
          }
        }}
        placeholder="Who is the driver with more race starts?"
        className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/90 ring-0 outline-none resize-none py-2.5 px-2 font-mono text-sm min-h-10 w-full transition-all duration-300"
      />
      <SubmitButton ref={submitRef} />
    </form>
  );
}
