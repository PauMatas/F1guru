"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

export default function LastUpdate() {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLastUpdate() {
      const response = await axios.get("/api/last_update");
      setLastUpdate(response.data.lastUpdate);
    }
    fetchLastUpdate();
  }, []);

  return lastUpdate ? (
    <p className="text-card-foreground mb-12 text-base animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
      The most recent data we have is from {lastUpdate}.
    </p>
  ) : (
    <Skeleton className="h-6 w-96 mb-12" />
  );
}
