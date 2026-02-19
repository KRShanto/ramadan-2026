import ramadanDataRaw from "../public/ramadan-calendar.json";

// Type definition for the raw JSON data
interface RawPrayerData {
  day: number;
  gregorian: string;
  weekday_bn: string;
  sehri_end: string;
  iftar: string;
}

interface RawJsonData {
  divisions: {
    [key: string]: RawPrayerData[];
  };
}

const ramadanData = ramadanDataRaw as unknown as RawJsonData;

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

// Transform raw data to our internal interface
const transformData = (data: RawPrayerData[]): DailyPrayerTimes[] => {
  return data.map((d) => ({
    day: d.day,
    date: new Date(d.gregorian),
    sehriEnd: d.sehri_end,
    fajr: d.sehri_end,
    dhuhr: "12:15", // Placeholder / Average
    asr: "16:15", // Placeholder / Average
    maghrib: d.iftar,
    isha: "19:30", // Placeholder / Average
    iftarTime: d.iftar,
  }));
};

// Default export (Dhaka) for backward compatibility and initial server render
export const ramadanPrayerTimes: DailyPrayerTimes[] = transformData(
  ramadanData.divisions["Dhaka"] || [],
);

// Get prayer times for a specific city
export function getPrayerTimesForCity(city: string): DailyPrayerTimes[] {
  const cityData = ramadanData.divisions[city];
  if (!cityData) {
    // Fallback to Dhaka if city not found
    return ramadanPrayerTimes;
  }
  return transformData(cityData);
}

export function getTodayPrayerTimes(
  city: string = "Dhaka",
): DailyPrayerTimes | null {
  const prayers = getPrayerTimesForCity(city);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const dayStr = String(today.getDate()).padStart(2, "0");
  const todayFormatted = `${year}-${month}-${dayStr}`;

  // Find today's entry in the data
  const todayEntry = prayers.find(
    (p) => p.date.toISOString().split("T")[0] === todayFormatted,
  );

  if (todayEntry) {
    return todayEntry;
  }

  // If not found (e.g., before/after Ramadan), return the first day as fallback/demo
  return prayers[0] || null;
}
