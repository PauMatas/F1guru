import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 h-auto bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <ModeToggle />
      </div>
    </div>
  );
}
