"use client";

import { useRef } from "react";
import { SubmitButton } from "./submit-button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { QuestionCreationRequest } from "@/lib/validators/question";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface QuestionFormProps {
  initialPrompt?: string;
}

export function QuestionForm({ initialPrompt }: QuestionFormProps) {
  const submitRef = useRef<React.ElementRef<"button">>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: createQuestion } = useMutation({
    mutationFn: async (payload: QuestionCreationRequest) => {
      const { data } = await axios.post("/api/question/create", payload);
      return data; // question id
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Connection error, please refresh the page.",
      });
    },
    onSuccess: (id) => {
      router.push(`/q/${id}`);
      router.refresh();
    },
  });

  async function onSubmit(data: FormData) {
    const prompt = (data.get("prompt") as string | null)?.trim().replaceAll(":", "");
    if (!prompt) return; // no need to display an error message for blank prompts
    const response = await axios.get("/api/answer/mockup", { params: { q: prompt } });

    const payload: QuestionCreationRequest = {
      prompt,
      answer: response.data.answer,
    };

    createQuestion(payload);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  };

  return (
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
  );
}
