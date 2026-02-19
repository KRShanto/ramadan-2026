import ramadanData from "../public/ramadan-calendar.json";

export interface DailyPrayerTimes {
  day: number;
  date: Date;
  sehriEnd: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  iftarTime: string;
}

// Map the JSON data to the DailyPrayerTimes interface
// Note: JSON only contains sehri_end and iftar, so we use them for fajr/maghrib
// and placeholders for other prayers until full data is available.
export const ramadanPrayerTimes: DailyPrayerTimes[] = (
  ramadanData as any[]
).map((d) => ({
  day: d.day,
  date: new Date(d.gregorian),
  sehriEnd: d.sehri_end,
  fajr: d.sehri_end,
  dhuhr: "12:10", // Placeholder for 2026
  asr: "16:20", // Placeholder for 2026
  maghrib: d.iftar,
  isha: "19:35", // Placeholder for 2026
  iftarTime: d.iftar,
}));

export function getPrayerTimesForDay(day: number): DailyPrayerTimes | null {
  return ramadanPrayerTimes.find((time) => time.day === day) || null;
}

export function getTodayPrayerTimes(): DailyPrayerTimes | null {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const dayStr = String(today.getDate()).padStart(2, "0");
  const todayFormatted = `${year}-${month}-${dayStr}`;

  // Find today's entry in our data
  const todayEntry = ramadanPrayerTimes.find(
    (p) => p.date.toISOString().split("T")[0] === todayFormatted,
  );

  if (todayEntry) {
    return todayEntry;
  }

  // If we're not in Ramadan yet, or it's over, return null or a default
  // For demo/dev purposes, let's return day 1 if we are before or after Ramadan
  return ramadanPrayerTimes[0];
}
