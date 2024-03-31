import { ButtonCard } from "./button-card";

interface QuestionCardProps {
  id: string;
}

export function QuestionCard({ id }: QuestionCardProps) {
  return <ButtonCard id={id} />;
}
