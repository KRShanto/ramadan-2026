"use client";

import { useEffect, useState } from "react";
import { CountdownCard } from "@/components/countdown-card";
import { getTodayPrayerTimes, DailyPrayerTimes } from "@/lib/prayer-data";
import { useCityStore } from "@/store/city-store";

export default function Home() {
  const { selectedCity } = useCityStore();
  const [todayPrayers, setTodayPrayers] = useState<DailyPrayerTimes | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const prayers = getTodayPrayerTimes();
    setTodayPrayers(prayers);

    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  if (!todayPrayers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6 pb-32">
        {/* Current Date and Day Number */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {currentDate}
          </p>
          <div className="space-y-0.5">
            <p className="text-3xl font-bold text-primary">
              দিন {todayPrayers.day}
            </p>
            <p className="text-sm text-muted-foreground font-medium">রমজানের</p>
          </div>
        </div>

        {/* Countdown Cards */}
        <div className="space-y-4">
          <CountdownCard
            title="সেহরি শেষ"
            time={todayPrayers.sehriEnd}
            icon="🌙"
          />
          <CountdownCard
            title="ইফতার সময়"
            time={todayPrayers.iftarTime}
            icon="🌅"
          />
          <CountdownCard
            title="পরবর্তী নামাজ - আসর"
            time={todayPrayers.asr}
            icon="🕌"
          />
        </div>

        {/* Info Section */}
        <div className="premium-card p-5 text-center space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            সমস্ত সময়{" "}
            <span className="text-foreground font-semibold">
              {selectedCity.name}, বাংলাদেশ
            </span>{" "}
            এর জন্য
          </p>
          <p className="text-xs text-muted-foreground">
            স্থানের উপর ভিত্তি করে সময় পরিবর্তিত হতে পারে
          </p>
        </div>
      </main>
    </div>
  );
}
