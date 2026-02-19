import prayerDataRaw from "../public/prayer.json";

// Raw types for public/prayer.json
interface MonthlyPrayerData {
  day: number;
  sehri_end: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface DivisionData {
  name_bn: string;
  months: {
    [key: string]: MonthlyPrayerData[]; // "02", "03", etc.
  };
}

interface PrayerJsonData {
  source: string;
  year: number;
  divisions: {
    [key: string]: DivisionData;
  };
}

const prayerData = prayerDataRaw as unknown as PrayerJsonData;

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

const RAMADAN_START_DATE = new Date("2026-02-19");
const RAMADAN_DAYS_COUNT = 30;

// Helper to get prayer times for a specific date and city from the JSON
function getPrayerTimesForDate(
  city: string,
  date: Date,
): MonthlyPrayerData | null {
  const divisionData =
    prayerData.divisions[city] || prayerData.divisions["Dhaka"];
  if (!divisionData) return null;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = date.getDate();

  const monthData = divisionData.months[month];
  if (!monthData) return null;

  return monthData.find((d) => d.day === day) || null;
}

// Generate the 30-day Ramadan schedule for a given city
export function getPrayerTimesForCity(city: string): DailyPrayerTimes[] {
  const schedule: DailyPrayerTimes[] = [];
  const currentDate = new Date(RAMADAN_START_DATE);

  for (let i = 1; i <= RAMADAN_DAYS_COUNT; i++) {
    // Clone date to avoid mutation issues in loop if not careful,
    // though distinct objects are best.
    const dateObj = new Date(currentDate);

    // Fetch data for this gregorian date
    const dailyData = getPrayerTimesForDate(city, dateObj);

    if (dailyData) {
      schedule.push({
        day: i,
        date: dateObj,
        sehriEnd: dailyData.sehri_end,
        fajr: dailyData.fajr,
        dhuhr: dailyData.dhuhr,
        asr: dailyData.asr,
        maghrib: dailyData.maghrib,
        isha: dailyData.isha,
        iftarTime: dailyData.maghrib, // Iftar is Maghrib
      });
    } else {
      // Fallback if data missing (shouldn't happen with valid JSON)
      schedule.push({
        day: i,
        date: dateObj,
        sehriEnd: "00:00",
        fajr: "00:00",
        dhuhr: "00:00",
        asr: "00:00",
        maghrib: "00:00",
        isha: "00:00",
        iftarTime: "00:00",
      });
    }

    // Increment date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
}

// Default export (Dhaka) for backward compatibility
export const ramadanPrayerTimes: DailyPrayerTimes[] =
  getPrayerTimesForCity("Dhaka");

// Get today's prayer times for a specific city
// Returns null if today is not within Ramadan (or just returns nearest day or default for safety)
export function getTodayPrayerTimes(
  city: string = "Dhaka",
): DailyPrayerTimes | null {
  const today = new Date();

  // Calculate day of Ramadan
  // Diff in time
  const diffTime = today.getTime() - RAMADAN_START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const ramadanDay = diffDays + 1;

  // Check if within Ramadan range
  if (ramadanDay >= 1 && ramadanDay <= RAMADAN_DAYS_COUNT) {
    const dailyData = getPrayerTimesForDate(city, today);
    if (dailyData) {
      return {
        day: ramadanDay,
        date: today,
        sehriEnd: dailyData.sehri_end,
        fajr: dailyData.fajr,
        dhuhr: dailyData.dhuhr,
        asr: dailyData.asr,
        maghrib: dailyData.maghrib,
        isha: dailyData.isha,
        iftarTime: dailyData.maghrib,
      };
    }
  }

  // If not in Ramadan, maybe return the first day or null?
  // Current app behavior: returns something to show.
  // Let's return the first day of Ramadan (Dhaka or City) as a fallback preview
  return getPrayerTimesForCity(city)[0];
}
