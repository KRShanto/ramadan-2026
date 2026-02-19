"use client";

import { useEffect, useState } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CountdownCard } from "@/components/countdown-card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getTodayPrayerTimes, DailyPrayerTimes } from "@/lib/prayer-data";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// City data with their offsets from Dhaka (minutes)
const divisions = [
  { name: "ঢাকা", value: "Dhaka", offset: 0 },
  { name: "চট্টগ্রাম", value: "Chattogram", offset: -5 },
  { name: "খুলনা", value: "Khulna", offset: 5 },
  { name: "রাজশাহী", value: "Rajshahi", offset: 7 },
  { name: "বরিশাল", value: "Barishal", offset: 1 },
  { name: "সিলেট", value: "Sylhet", offset: -6 },
  { name: "রংপুর", value: "Rangpur", offset: 6 },
  { name: "ময়মনসিংহ", value: "Mymensingh", offset: 0 },
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(divisions[0]);
  const [todayPrayers, setTodayPrayers] = useState<DailyPrayerTimes | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Check for saved city in localStorage
    const savedCityValue = localStorage.getItem("selectedCity");
    if (savedCityValue) {
      const city = divisions.find((d) => d.value === savedCityValue);
      if (city) setSelectedCity(city);
    }
  }, []);

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
  }, [selectedCity]);

  const handleCityChange = (value: string) => {
    const city = divisions.find((d) => d.value === value);
    if (city) {
      setSelectedCity(city);
      localStorage.setItem("selectedCity", value);
    }
  };

  if (!todayPrayers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/30 z-40 safe-top">
        <div className="max-w-2xl mx-auto px-5 py-4 flex justify-between items-center gap-4">
          <div className="space-y-0.5 min-w-0">
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent truncate">
              রমজান
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {selectedCity.name}, বাংলাদেশ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCity.value} onValueChange={handleCityChange}>
              <SelectTrigger className="h-10 w-[120px] bg-card border-border rounded-lg text-base font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <SelectValue placeholder="শহর" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {divisions.map((city) => (
                  <SelectItem
                    key={city.value}
                    value={city.value}
                    className="text-base"
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
