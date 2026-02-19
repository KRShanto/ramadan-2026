"use client";

import { ramadanPrayerTimes, getTodayPrayerTimes } from "@/lib/prayer-data";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [currentDay, setCurrentDay] = useState<number>(0);

  useEffect(() => {
    const todayData = getTodayPrayerTimes();
    if (todayData) {
      setCurrentDay(todayData.day);

      // Auto-scroll to today after a short delay to ensure rendering is complete
      setTimeout(() => {
        const element = document.getElementById(`day-${todayData.day}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Calendar Cards */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="space-y-3">
          {ramadanPrayerTimes.map((day) => {
            const isToday = day.day === currentDay;
            const dayName = day.date.toLocaleDateString("bn-BD", {
              weekday: "short",
            });
            const dateStr = day.date.toLocaleDateString("bn-BD", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={day.day}
                id={`day-${day.day}`}
                className={`premium-card p-5 space-y-3 transition-all duration-300 ${
                  isToday
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
                    : ""
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        isToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      রমজান {String(day.day).padStart(2, "0")}
                    </span>
                    {isToday && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    {dayName} • {dateStr}
                  </span>
                </div>

                {/* Prayer times */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      সেহরি শেষ
                    </p>
                    <p className="text-lg font-mono font-bold text-primary">
                      {day.sehriEnd}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      ইফতার
                    </p>
                    <p className="text-lg font-mono font-bold text-accent">
                      {day.iftarTime}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 premium-card p-6 text-center space-y-2 border-dashed">
          <p className="text-xs text-muted-foreground leading-relaxed">
            সব সময়{" "}
            <span className="text-foreground font-semibold">
              ঢাকা, বাংলাদেশ
            </span>{" "}
            এর জন্য প্রযোজ্য
          </p>
          <p className="text-[10px] text-muted-foreground/60 italic">
            * আপনার লোকেশনের ওপর ভিত্তি করে সময় ১-২ মিনিট কম-বেশি হতে পারে
          </p>
        </div>
      </main>
    </div>
  );
}
