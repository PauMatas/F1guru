"use client";

import { useRef, useState } from "react";
import { SubmitButton } from "./submit-button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

interface QuestionFormProps {
  initialPrompt?: string;
}

export function QuestionForm({ initialPrompt }: QuestionFormProps) {
  const [answer, setAnswer] = useState<string>("");

  const submitRef = useRef<React.ElementRef<"button">>(null);

  async function onSubmit(data: FormData) {
    const prompt = (data.get("prompt") as string | null)?.trim().replaceAll(":", "");
    if (!prompt) return; // no need to display an error message for blank prompts
    const response = await axios.get("/api/answer/mockup", { params: { q: prompt } });

    setAnswer(response.data.answer);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  };

  return (
    <div className="max-w-md space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
      <form
        onSubmit={handleSubmit}
        className="bg-primary rounded-xl shadow-lg h-fit flex flex-row px-1 items-center w-full"
      >
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
      {answer ? (
        <p className="font-normal text-l text-foreground animate-in fade-in slide-in-from-bottom-3 duration-1000 ease-in-out">
          {answer}
        </p>
      ) : (
        <Skeleton className="h-9 w-full" />
      )}
    </div>
  );
}
