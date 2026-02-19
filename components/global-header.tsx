"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { divisions } from "@/lib/divisions";

export function GlobalHeader() {
  const [selectedCity, setSelectedCity] = useState(divisions[0]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedCity");
    if (saved) {
      const city = divisions.find((d) => d.value === saved);
      if (city) setSelectedCity(city);
    }
  }, []);

  const handleCityChange = (value: string) => {
    const city = divisions.find((d) => d.value === value);
    if (city) {
      setSelectedCity(city);
      localStorage.setItem("selectedCity", value);
    }
  };

  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/30 z-40 safe-top">
      <div className="max-w-2xl mx-auto px-5 py-3 flex justify-between items-center gap-4">
        <div className="flex-1">
          <Image
            src="/logo.png"
            alt="Ramadan Calendar"
            width={150}
            height={150}
            className="h-15 w-auto object-contain"
            priority
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
  );
}
