import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrompt = (prompt: string) => prompt.replace(/ /g, "-").replace(/-+/g, "-").toLocaleLowerCase();
