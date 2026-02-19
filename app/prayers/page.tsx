"use client";

import { getTodayPrayerTimes } from "@/lib/prayer-data";
import { useEffect, useState } from "react";
import { divisions } from "@/lib/divisions";
import { useCityStore } from "@/store/city-store";

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  isNext?: boolean;
}

// Helper to convert time "HH:MM" to minutes for comparison
const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

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
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Sequential list of prayer times for today
      // Including Sehri end (Fajr start roughly) and Iftar (Maghrib)
      // Standard 5 prayers: Fajr, Dhuhr, Asr, Maghrib, Isha
      // Sehri end is before Fajr usually, or same time.
      const times = [
        { name: "ফজর", time: todayPrayers.fajr },
        { name: "যোহর", time: todayPrayers.dhuhr },
        { name: "আসর", time: todayPrayers.asr },
        { name: "মাগরিব", time: todayPrayers.maghrib },
        { name: "ইশা", time: todayPrayers.isha },
      ];

      // Find the first prayer that hasn't happened yet
      const nextIndex = times.findIndex((t) => {
        return timeToMinutes(t.time) > currentMinutes;
      });

      // If all passed (nextIndex -1), it means next is Fajr tomorrow (or next cycle)
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
    { name: "ফজর", time: todayPrayers.fajr, icon: "🌙" },
    { name: "যোহর", time: todayPrayers.dhuhr, icon: "☀️" },
    { name: "আসর", time: todayPrayers.asr, icon: "🌤️" },
    { name: "মাগরিব", time: todayPrayers.maghrib, icon: "🌅" },
    { name: "ইশা", time: todayPrayers.isha, icon: "🌙" },
  ];

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
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    {prayer.name}
                    {isNext && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        পরবর্তী
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    দৈনিক নামাজ
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-xl font-mono font-bold ${isNext ? "text-primary" : "text-foreground"}`}
                >
                  {prayer.time}
                </div>
              </div>
            </div>
          );
        })}

        {/* Special Times */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-2">
            বিশেষ সময়
          </h2>

          <div className="premium-card p-4 space-y-2 bg-linear-to-br from-primary/10 to-transparent border-primary/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🌙</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    সেহরি শেষ
                  </p>
                  <p className="text-xs text-muted-foreground">
                    রোজা শুরুর আগে খাওয়ার শেষ সময়
                  </p>
                </div>
              </div>
              <div className="text-lg font-mono font-bold text-primary text-right">
                {todayPrayers.fajr}
              </div>
            </div>
          </div>

          <div className="premium-card p-4 space-y-2 bg-linear-to-br from-accent/10 to-transparent border-accent/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🌅</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    ইফতার সময়
                  </p>
                  <p className="text-xs text-muted-foreground">
                    রোজা ভাঙ্গার সময়
                  </p>
                </div>
              </div>
              <div className="text-lg font-mono font-bold text-accent text-right">
                {todayPrayers.iftarTime}
              </div>
            </div>
          </div>
        </div>

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
