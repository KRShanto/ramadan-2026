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

  const formattedRemaining = `${toBn(remaining.hours)} : ${toBn(remaining.minutes)} : ${toBn(remaining.seconds)}`;

  // Display the target time in Bengali format
  const formattedTargetTime = formatTimeToBengali(time);

  return (
    <div className="premium-card p-6 space-y-4 relative overflow-hidden border-primary/30">
      <div className="relative z-10 flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>

      <div className="relative z-10 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          বাকি সময়
        </p>
        <div className="text-4xl font-bold text-primary font-mono tracking-tight">
          {formattedRemaining}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">সময়</span>
          <span className="text-lg font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">
            {formattedTargetTime}
          </span>
        </div>
      </div>
    </div>
  );
}
