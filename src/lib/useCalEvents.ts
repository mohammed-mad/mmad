import { useEffect, useState } from "react";
import { CAL_REFRESH_MS, fetchCalEvent, fetchNextSession, type CalEventDetails } from "@/lib/cal-events";

export interface CalEventState { event: CalEventDetails | null; status: "loading" | "ready" | "unavailable" }
const states = new Map<string, CalEventState>();
const listeners = new Set<() => void>();
const pending = new Map<string, Promise<void>>();

function refresh(slug: string): Promise<void> {
  const running = pending.get(slug);
  if (running) return running;
  const request = (async () => {
    try {
      let event = await fetchCalEvent(slug);
      if (event) event = { ...event, nextSession: await fetchNextSession(event).catch(() => null) };
      states.set(slug, { event, status: event ? "ready" : "unavailable" });
    } catch { states.set(slug, { event: null, status: "unavailable" }); }
    listeners.forEach((listener) => listener());
  })().finally(() => pending.delete(slug));
  pending.set(slug, request);
  return request;
}

/** Shared requests, refreshed every 30 seconds and when the visitor returns to the page. */
export function useCalEvents(slugs: string[]): Record<string, CalEventState> {
  const key = [...new Set(slugs)].sort().join("|");
  const [, render] = useState(0);
  useEffect(() => {
    const names = key ? key.split("|") : [];
    const update = () => render((n) => n + 1);
    const refreshAll = () => { if (document.visibilityState !== "hidden") names.forEach((slug) => { void refresh(slug); }); };
    listeners.add(update);
    refreshAll();
    const timer = window.setInterval(refreshAll, CAL_REFRESH_MS);
    window.addEventListener("focus", refreshAll);
    document.addEventListener("visibilitychange", refreshAll);
    return () => { listeners.delete(update); window.clearInterval(timer); window.removeEventListener("focus", refreshAll); document.removeEventListener("visibilitychange", refreshAll); };
  }, [key]);
  return Object.fromEntries(slugs.map((slug) => [slug, states.get(slug) ?? { event: null, status: "loading" }]));
}
