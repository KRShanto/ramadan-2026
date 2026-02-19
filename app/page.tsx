"use client";

import { useEffect, useState } from "react";
import { CountdownCard } from "@/components/countdown-card";
import { getTodayPrayerTimes, DailyPrayerTimes } from "@/lib/prayer-data";
import { getNextPrayerTime } from "@/lib/prayer-times";
import { useCityStore } from "@/store/city-store";

export default function Home() {
  const { selectedCity } = useCityStore();
  const [todayPrayers, setTodayPrayers] = useState<DailyPrayerTimes | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    if (selectedCity) {
      const prayers = getTodayPrayerTimes(selectedCity.value);
      setTodayPrayers(prayers);
    }

    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, [selectedCity]);

  // Update next prayer periodically
  useEffect(() => {
    if (!todayPrayers) return;

    const updateNextPrayer = () => {
      const next = getNextPrayerTime(todayPrayers);
      setNextPrayer(next);
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todayPrayers]);

  if (!todayPrayers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">লোড হচ্ছে...</div>
      </div>
    );
  }

  // Format the day number to Bengali
  const dayBn = new Intl.NumberFormat("bn-BD").format(todayPrayers.day);

  // Bengali translation map
  const prayerNamesBn: Record<string, string> = {
    Fajr: "ফজর",
    Dhuhr: "যোহর",
    Asr: "আসর",
    Maghrib: "মাগরিব",
    Isha: "ইশা",
  };

  const nextPrayerNameBn = nextPrayer
    ? prayerNamesBn[nextPrayer.name] || nextPrayer.name
    : "";

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
            <p className="text-3xl font-bold text-primary">দিন {dayBn}</p>
            <p className="text-sm text-muted-foreground font-medium">রমজানের</p>
          </div>
        </div>

        {/* Countdown Cards */}
        {/* Pass ONLY English Format Times (e.g. "05:12") to CountdownCard logic props */}
        <div className="space-y-4">
          <CountdownCard title="সেহরি শেষ" time={todayPrayers.fajr} icon="🌙" />
          <CountdownCard
            title="ইফতার সময়"
            time={todayPrayers.iftarTime}
            icon="🌅"
          />
          {nextPrayer && (
            <CountdownCard
              title={`পরবর্তী নামাজ - ${nextPrayerNameBn}`}
              time={nextPrayer.time}
              icon="🕌"
            />
          )}
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
