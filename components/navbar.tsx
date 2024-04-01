import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { BODY_PADDING } from "@/app/config";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <header
      className={cn(
        "top-0 sticky z-20 w-full py-3 bg-background flex flex-row flex-nowrap justify-between max-w-5xl mx-auto h-14 items-stretch animate-in fade-in slide-in-from-top-4 duration-1000 ease-in-out",
        BODY_PADDING,
      )}
    >
      <Link
        className={cn(
          buttonVariants({ variant: "link", size: "lg" }),
          "flex flex-row flex-nowrap items-center justify-center gap-x-1.5 pr-1.5 leading-none",
        )}
        href="/"
      >
        {/* Icons.icon */}
        <span>🏎 F1 Guru</span>
      </Link>
      <ModeToggle />
    </header>
  );
}
