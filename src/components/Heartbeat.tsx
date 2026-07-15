"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function Heartbeat() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const ping = () => fetch("/api/heartbeat", { method: "POST" }).catch(() => {});
    ping();
    const interval = setInterval(ping, 60_000);
    return () => clearInterval(interval);
  }, [status]);

  return null;
}
