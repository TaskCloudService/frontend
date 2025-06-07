"use client";
import useSWR from "swr";

async function fetcher(url: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export function useEventStats(eventId: string) {
  const { data, error, isLoading } = useSWR(
    `/api/event-stats/${eventId}`,
    fetcher,
    { refreshInterval: 10_000 }   
  );

  return {
    stats: data as
      | { capacity: number; ticketsSold: number; ticketsLeft: number; percentSold: number }
      | undefined,
    isLoading,
    isError: !!error,
  };
}
