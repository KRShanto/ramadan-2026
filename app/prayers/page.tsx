"use client";

import { getTodayPrayerTimes } from "@/lib/prayer-data";
import { useEffect, useState } from "react";
import { divisions } from "@/lib/divisions";

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

export default function PrayersPage() {
  const [selectedCity, setSelectedCity] = useState(divisions[0]);
  const [todayPrayers, setTodayPrayers] = useState(
    getTodayPrayerTimes(divisions[0].value),
  );

  useEffect(() => {
    // Check for saved city in localStorage for footer consistency
    const savedCityValue = localStorage.getItem("selectedCity");
    if (savedCityValue) {
      const city = divisions.find((d) => d.value === savedCityValue);
      if (city) {
        setSelectedCity(city);
        // Important: Update prayers to match saved city immediately on mount if possible
        const prayers = getTodayPrayerTimes(city.value);
        setTodayPrayers(prayers);
      }
    }

    // Also listen for changes in other details if needed, but here simple load is fine.
  }, []);

  // Update prayers when selectedCity changes (if controlled elsewhere or local state updates)
  useEffect(() => {
    const prayers = getTodayPrayerTimes(selectedCity.value);
    setTodayPrayers(prayers);
  }, [selectedCity]);

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
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className="premium-card p-4 flex items-center justify-between transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{prayer.icon}</div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {prayer.name}
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  দৈনিক নামাজ
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-primary">
                {prayer.time}
              </div>
            </div>
          </div>
        ))}

        {/* Special Times */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-2">
            বিশেষ সময়
          </h2>

          <div className="premium-card p-4 space-y-2 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
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
                {todayPrayers.sehriEnd}
              </div>
            </div>
          </div>

          <div className="premium-card p-4 space-y-2 bg-gradient-to-br from-accent/10 to-transparent border-accent/30">
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
