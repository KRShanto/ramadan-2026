'use client';

import { ramadanPrayerTimes } from '@/lib/prayer-data';
import { BottomNavigation } from '@/components/bottom-navigation';
import { useEffect, useState } from 'react';

export default function CalendarPage() {
  const [currentDay, setCurrentDay] = useState<number>(0);

  useEffect(() => {
    const today = new Date();
    const ramadanStart = new Date(2024, 2, 12);
    const ramadanEnd = new Date(2024, 3, 11);

    if (today >= ramadanStart && today <= ramadanEnd) {
      const dayNumber = Math.floor(
        (today.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      setCurrentDay(dayNumber);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/30 z-40 safe-top">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            রমজান ক্যালেন্ডার
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">সমস্ত ৩০ দিন</p>
        </div>
      </header>

      {/* Calendar Cards */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="space-y-3">
          {ramadanPrayerTimes.map((day) => {
            const isToday = day.day === currentDay;
            const dayName = day.date.toLocaleDateString('bn-BD', { weekday: 'short' });
            const dateStr = day.date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
            
            return (
              <div
                key={day.day}
                className={`premium-card p-5 space-y-3 transition-all duration-200 ${
                  isToday ? 'border-primary/50 bg-primary/5' : ''
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      isToday ? 'text-primary' : 'text-foreground'
                    }`}>
                      দিন {String(day.day).padStart(2, '0')}
                    </span>
                    {isToday && <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{dayName} • {dateStr}</span>
                </div>

                {/* Prayer times */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">সেহরি শেষ</p>
                    <p className="text-base font-bold text-primary">{day.sehriEnd}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">ইফতার</p>
                    <p className="text-base font-bold text-accent">{day.iftarTime}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 premium-card p-5 text-center space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            সমস্ত সময় <span className="text-foreground font-semibold">ঢাকা, বাংলাদেশ</span> এর জন্য
          </p>
          <p className="text-xs text-muted-foreground">
            স্থানের উপর ভিত্তি করে সময় পরিবর্তিত হতে পারে
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
