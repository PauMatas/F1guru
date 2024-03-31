"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [response, setResponse] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResponse = async () => {
      setIsLoading(true);
      const response = await axios.get("/api/answer/mockup", {
        params: { q: "What is Next.js?" },
      });
      setResponse(response.data.answer);
      setIsLoading(false);
    };
    fetchResponse();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        {isLoading ? <Skeleton /> : <p>{response}</p>}
      </div>
    </main>
  );
}
