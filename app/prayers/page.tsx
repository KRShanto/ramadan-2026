"use client";

import { getTodayPrayerTimes, formatTimeToBengali } from "@/lib/prayer-data";
import { useEffect, useState } from "react";
import { useCityStore } from "@/store/city-store";
import { set, isAfter } from "date-fns";

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  isNext?: boolean;
}

export default function PrayersPage() {
  const { selectedCity } = useCityStore();
  const [todayPrayers, setTodayPrayers] = useState(
    getTodayPrayerTimes(selectedCity.value),
  );
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(-1);

  // Sync with store
  useEffect(() => {
    const prayers = getTodayPrayerTimes(selectedCity.value);
    setTodayPrayers(prayers);
  }, [selectedCity]);

  // Determine next prayer based on current time
  useEffect(() => {
    if (!todayPrayers) return;

    const calculateNextPrayer = () => {
      const now = new Date();

      const times = [
        { name: "ফজর", time: todayPrayers.fajr },
        { name: "যোহর", time: todayPrayers.dhuhr },
        { name: "আসর", time: todayPrayers.asr },
        { name: "মাগরিব", time: todayPrayers.maghrib },
        { name: "ইশা", time: todayPrayers.isha },
      ];

      // Find the first prayer that hasn't happened yet
      const nextIndex = times.findIndex((t) => {
        const [h, m] = t.time.split(":").map(Number);
        const prayerTime = set(now, { hours: h, minutes: m, seconds: 0 });
        // Return true if prayer time is AFTER current time
        return isAfter(prayerTime, now);
      });

      setNextPrayerIndex(nextIndex);
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todayPrayers]);

  if (!todayPrayers) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div>লোড হচ্ছে...</div>
      </div>
    );
  }

  const prayers: PrayerTime[] = [
    { name: "ফজর", time: formatTimeToBengali(todayPrayers.fajr), icon: "🌙" },
    { name: "যোহর", time: formatTimeToBengali(todayPrayers.dhuhr), icon: "☀️" },
    { name: "আসর", time: formatTimeToBengali(todayPrayers.asr), icon: "🌤️" },
    {
      name: "মাগরিব",
      time: formatTimeToBengali(todayPrayers.maghrib),
      icon: "🌅",
    },
    { name: "ইশা", time: formatTimeToBengali(todayPrayers.isha), icon: "🌙" },
  ];

  const formattedSehriEnd = formatTimeToBengali(todayPrayers.fajr);
  const formattedIftar = formatTimeToBengali(todayPrayers.iftarTime);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Prayer Times */}
      <main className="max-w-2xl mx-auto px-5 py-8 space-y-3">
        {prayers.map((prayer, index) => {
          const isNext = index === nextPrayerIndex;

          return (
            <div
              key={prayer.name}
              className={`premium-card p-4 flex items-center justify-between transition-all duration-300 ${isNext ? "ring-2 ring-primary border-primary/50 bg-primary/5" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{prayer.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    {prayer.name}
                    {isNext && (
                      <span className="text-[12px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        পরবর্তী
                      </span>
                    )}
                  </h2>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-mono font-bold ${isNext ? "text-primary" : "text-foreground"}`}
                >
                  {prayer.time}
                </div>
              </div>
            </div>
          );
        })}

        {/* Info Section */}
        <div className="mt-8 premium-card p-5 text-center space-y-1.5">
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
