'use client';

import { useEffect, useState } from 'react';
import { TimeRemaining, getTimeUntilString, formatTimeRemaining } from '@/lib/prayer-times';

interface CountdownCardProps {
  title: string;
  time: string;
  icon: React.ReactNode;
}

export function CountdownCard({ title, time, icon }: CountdownCardProps) {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const timeRemaining = getTimeUntilString(time);
      setRemaining(timeRemaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [time]);

  if (!remaining) {
    return null;
  }

  return (
    <div className="premium-card p-6 space-y-4 relative overflow-hidden border-primary/30">
      <div className="relative z-10 flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      
      <div className="relative z-10 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">বাকি সময়</p>
        <div className="text-4xl font-bold text-primary font-mono tracking-tight">
          {formatTimeRemaining(remaining)}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">সময়</span>
          <span className="text-lg font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">{time}</span>
        </div>
      </div>
    </div>
  );
}
