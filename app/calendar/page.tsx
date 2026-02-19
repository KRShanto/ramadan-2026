"use client";

import { useEffect, useState } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useCityStore } from "@/store/city-store";
import {
  getPrayerTimesForCity,
  DailyPrayerTimes,
  formatTimeToBengali,
} from "@/lib/prayer-data";

export default function CalendarPage() {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [calendarDays, setCalendarDays] = useState<DailyPrayerTimes[]>([]);
  const { selectedCity } = useCityStore();

  // Load calendar data from shared utility
  useEffect(() => {
    const days = getPrayerTimesForCity(selectedCity.value);
    setCalendarDays(days);
  }, [selectedCity]);

  // Set current day for auto-scroll
  useEffect(() => {
    if (calendarDays.length > 0) {
      const today = new Date();
      // Use local date string for comparison to avoid UTC shifts
      const todayStr = today.toLocaleDateString("en-CA");

      const todayEntry = calendarDays.find((d) => {
        return d.date.toLocaleDateString("en-CA") === todayStr;
      });

      if (todayEntry) {
        setCurrentDay(todayEntry.day);
        setTimeout(() => {
          const element = document.getElementById(`day-${todayEntry.day}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      }
    }
  }, [calendarDays]);

  if (calendarDays.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div>লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Calendar Cards */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="space-y-3">
          {calendarDays.map((day) => {
            const isToday = day.day === currentDay;

            // Format Date
            const dateStr = day.date.toLocaleDateString("bn-BD", {
              month: "short",
              day: "numeric",
            });
            const weekdayBn = day.date.toLocaleDateString("bn-BD", {
              weekday: "long",
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
                    {weekdayBn} • {dateStr}
                  </span>
                </div>

                {/* Prayer times */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      সেহরি শেষ
                    </p>
                    <p className="text-lg font-mono font-bold text-primary">
                      {formatTimeToBengali(day.fajr)}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      ইফতার
                    </p>
                    <p className="text-lg font-mono font-bold text-accent">
                      {formatTimeToBengali(day.iftarTime)}
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
              {selectedCity.name}, বাংলাদেশ
            </span>{" "}
            এর জন্য প্রযোজ্য
          </p>
          <p className="text-[10px] text-muted-foreground/60 italic">
            * সেহরি ও ইফতারের সময় ১ মিনিট কম-বেশি হতে পারে (সতর্কতামূলক)
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
