"use client";

import { Skeleton } from "../ui/skeleton";

interface ButtonCard {
  id: string;
}

export function ButtonCard({ id }: ButtonCard) {
  return (
    <Skeleton
      aria-hidden
      id={id}
      className="h-8 borders ring-1 ring-secondary flex flex-row flex-nowrap py-1 px-1.5 items-center shadow-sm rounded-xl gap-1.5 w-full relative group"
    >
      <div className="w-64" />
    </Skeleton>
  );
}
