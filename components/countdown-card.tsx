"use client";

import { useEffect, useState } from "react";
import { TimeRemaining, getTimeUntilString } from "@/lib/prayer-times";
import { formatTimeToBengali } from "@/lib/prayer-data";

interface CountdownCardProps {
  title: string;
  time: string; // "HH:MM" (english format)
  icon: React.ReactNode;
}

export function CountdownCard({ title, time, icon }: CountdownCardProps) {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      // getTimeUntilString expects "HH:MM" in English numerals
      const timeRemaining = getTimeUntilString(time);
      setRemaining(timeRemaining);
      return {
        hours: timeRemaining.hours,
        minutes: timeRemaining.minutes,
        seconds: timeRemaining.seconds,
      };
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [time]);

  if (!remaining) {
    return null;
  }

  // Format remaining time using Bengali numerals
  // We can pass English numbers to formatTimeToBengali-like logic or just implement simple numeral replacement
  const toBn = (n: number) =>
    new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2 }).format(n);

  // Display the target time in Bengali format
  const formattedTargetTime = formatTimeToBengali(time);

  return (
    <div className="premium-card p-5 relative overflow-hidden border-primary/20 flex flex-col gap-4">
      {/* Header: Icon, Title, Target Time */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl bg-secondary/40 p-2.5 rounded-xl border border-border/50 shadow-inner">
            {icon}
          </div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <div className="text-lg font-mono font-bold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full ring-1 ring-primary/30 shadow-sm">
          {formattedTargetTime}
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="relative z-10 bg-secondary/20 rounded-2xl p-4 border border-border/40 flex flex-col items-center justify-center shadow-inner">
        <p className="text-base font-semibold text-muted-foreground mb-3">
          বাকি সময়
        </p>
        <div className="flex items-center gap-4 text-4xl font-bold font-mono">
          <div className="flex flex-col items-center gap-1">
            <span className="w-14 text-center text-primary">
              {toBn(remaining.hours)}
            </span>
            <span className="text-sm text-muted-foreground font-semibold">
              ঘণ্টা
            </span>
          </div>
          <span className="pb-5 text-muted-foreground/30 text-2xl">:</span>
          <div className="flex flex-col items-center gap-1">
            <span className="w-14 text-center text-primary">
              {toBn(remaining.minutes)}
            </span>
            <span className="text-sm text-muted-foreground font-semibold">
              মিনিট
            </span>
          </div>
          <span className="pb-5 text-muted-foreground/30 text-2xl">:</span>
          <div className="flex flex-col items-center gap-1">
            <span className="w-14 text-center text-accent">
              {toBn(remaining.seconds)}
            </span>
            <span className="text-sm text-muted-foreground font-semibold">
              সেকেন্ড
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
