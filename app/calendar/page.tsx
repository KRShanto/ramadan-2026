"use client";

import { useEffect, useState } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { divisions } from "@/lib/divisions";

type CalendarDay = {
  day: number;
  gregorian: string;
  weekday_bn: string;
  sehri_end: string;
  iftar: string;
};

type CalendarData = {
  divisions: {
    [key: string]: CalendarDay[];
  };
};

export default function CalendarPage() {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [cityVal, setCityVal] = useState("Dhaka");
  const [cityNameBn, setCityNameBn] = useState("ঢাকা");

  // 1. Poll for city changes in localStorage
  useEffect(() => {
    // Initial read
    const saved = localStorage.getItem("selectedCity");
    if (saved) {
      setCityVal(saved);
      const found = divisions.find((d) => d.value === saved);
      if (found) setCityNameBn(found.name);
    }

    const interval = setInterval(() => {
      const current = localStorage.getItem("selectedCity");
      if (current && current !== cityVal) {
        setCityVal(current);
        const found = divisions.find((d) => d.value === current);
        if (found) setCityNameBn(found.name);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [cityVal]);

  // 2. Fetch JSON data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/ramadan-calendar.json");
        const data = await res.json();
        setCalendarData(data);
      } catch (error) {
        console.error("Failed to load calendar data", error);
      }
    }
    fetchData();
  }, []);

  // 3. Set current day for auto-scroll
  useEffect(() => {
    if (calendarData && calendarData.divisions[cityVal]) {
      const cityDays = calendarData.divisions[cityVal];
      const today = new Date();
      // Format today as YYYY-MM-DD to match JSON
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      const todayEntry = cityDays.find((d) => d.gregorian === todayStr);

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
  }, [calendarData, cityVal]);

  if (!calendarData || !calendarData.divisions[cityVal]) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div>লোড হচ্ছে...</div>
      </div>
    );
  }

  const cityDays = calendarData.divisions[cityVal];

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Calendar Cards */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="space-y-3">
          {cityDays.map((day) => {
            const isToday = day.day === currentDay;
            // Parse date for display (e.g., "12 Mar")
            const dateObj = new Date(day.gregorian);
            const dateStr = dateObj.toLocaleDateString("bn-BD", {
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
                    {day.weekday_bn} • {dateStr}
                  </span>
                </div>

                {/* Prayer times */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      সেহরি শেষ
                    </p>
                    <p className="text-lg font-mono font-bold text-primary">
                      {day.sehri_end}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      ইফতার
                    </p>
                    <p className="text-lg font-mono font-bold text-accent">
                      {day.iftar}
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
              {cityNameBn}, বাংলাদেশ
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
