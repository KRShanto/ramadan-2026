import prayerDataRaw from "../public/prayer.json";
import { differenceInDays, addDays, set, isAfter, format } from "date-fns";
import { bn } from "date-fns/locale";

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
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  iftarTime: string;
}

const RAMADAN_START_DATE = new Date("2026-02-19T00:00:00.000+06:00"); // Fixed timezone considering Bangladesh
const RAMADAN_DAYS_COUNT = 30;

// Helper to normalized 12h time string "04:30" to 24h string "16:30" if PM
function to24Hour(time: string, isPM: boolean = false): string {
  if (!time) return "00:00";
  let [h, m] = time.split(":").map(Number);

  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Helper to get prayer times for a specific date and city from the JSON
function getPrayerTimesForDate(
  city: string,
  date: Date,
): MonthlyPrayerData | null {
  const divisionData =
    prayerData.divisions[city] || prayerData.divisions["Dhaka"];
  if (!divisionData) return null;

  const month = format(date, "MM");
  const day = date.getDate();

  const monthData = divisionData.months[month];
  if (!monthData) return null;

  return monthData.find((d) => d.day === day) || null;
}

// Generate the 30-day Ramadan schedule for a given city
export function getPrayerTimesForCity(city: string): DailyPrayerTimes[] {
  const schedule: DailyPrayerTimes[] = [];
  let currentDate = new Date(RAMADAN_START_DATE);

  for (let i = 1; i <= RAMADAN_DAYS_COUNT; i++) {
    // Clone date to avoid mutation
    const dateObj = new Date(currentDate);

    // Fetch data for this gregorian date
    const dailyData = getPrayerTimesForDate(city, dateObj);

    if (dailyData) {
      // Normalize times to 24h format
      const fajr24 = to24Hour(dailyData.fajr, false); // AM
      const dhuhr24 = to24Hour(dailyData.dhuhr, true); // PM usually (12:xx or 1:xx) - Treating as PM context covers 12pm and 1pm. 11am would be wrong here?
      // Wait, Dhuhr can be 11:55 AM. If treated as PM, 11 -> 23:55. Incorrect.
      // Dhuhr logic refinements:
      // If starts with 11, treat as AM. If 12 or 01.. etc, treat as PM.
      // Let's make dhuhr logic inline below instead.

      let dhuhrFinal = dailyData.dhuhr;
      const [dH] = dailyData.dhuhr.split(":").map(Number);
      if (dH === 12 || dH < 11) {
        // 12:xx is PM. 1:xx is PM. 11:xx is AM.
        dhuhrFinal = to24Hour(dailyData.dhuhr, true);
      } else {
        dhuhrFinal = to24Hour(dailyData.dhuhr, false); // 11:xx AM
      }

      schedule.push({
        day: i,
        date: dateObj,
        fajr: fajr24,
        dhuhr: dhuhrFinal,
        asr: to24Hour(dailyData.asr, true), // PM
        maghrib: to24Hour(dailyData.maghrib, true), // PM
        isha: to24Hour(dailyData.isha, true), // PM
        iftarTime: to24Hour(dailyData.maghrib, true), // PM
      });
    } else {
      schedule.push({
        day: i,
        date: dateObj,
        fajr: "00:00",
        dhuhr: "00:00",
        asr: "00:00",
        maghrib: "00:00",
        isha: "00:00",
        iftarTime: "00:00",
      });
    }

    // Increment date
    currentDate = addDays(currentDate, 1);
  }

  return schedule;
}

// Default export (Dhaka) for backward compatibility
export const ramadanPrayerTimes: DailyPrayerTimes[] =
  getPrayerTimesForCity("Dhaka");

/**
 * Convert 24h string to 12h bn-BD string (e.g. "18:00" -> "৬:০০")
 */
export function formatTimeToBengali(time24: string): string {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const date = set(new Date(), { hours, minutes });

  // Format to 12h time in Bengali locale
  return format(date, "h:mm", { locale: bn });
}

// Get today's prayer times for a specific city
// Returns null if today is not within Ramadan (or just returns nearest day or default for safety)
export function getTodayPrayerTimes(
  city: string = "Dhaka",
): DailyPrayerTimes | null {
  const now = new Date();

  // Calculate difference in days using date-fns
  const diffDays = differenceInDays(now, RAMADAN_START_DATE);

  // Base Ramadan day (0-indexed offset from start)
  let ramadanDayIndex = diffDays;

  // Check Maghrib logic
  const todaysData = getPrayerTimesForDate(city, now);

  if (todaysData) {
    // Normalizing maghrib to 24h for comparison
    const maghrib24 = to24Hour(todaysData.maghrib, true);
    const [maghribHours, maghribMinutes] = maghrib24.split(":").map(Number);
    const maghribTime = set(now, {
      hours: maghribHours,
      minutes: maghribMinutes,
      seconds: 0,
    });

    // If current time is after Maghrib, increment day
    if (isAfter(now, maghribTime)) {
      ramadanDayIndex++;
    }
  }

  const ramadanDay = ramadanDayIndex + 1; // 1-based index

  // Check if calculated day is within valid range [1, 30]
  if (ramadanDay >= 1 && ramadanDay <= RAMADAN_DAYS_COUNT) {
    // Get the date corresponding to this Ramadan Day
    const targetDate = addDays(RAMADAN_START_DATE, ramadanDayIndex);

    // Fetch schedule for that specific date
    const dailyData = getPrayerTimesForDate(city, targetDate);

    if (dailyData) {
      // Normalize times exactly like above
      const fajr24 = to24Hour(dailyData.fajr, false);

      let dhuhrFinal = dailyData.dhuhr;
      const [dH] = dailyData.dhuhr.split(":").map(Number);
      // Dhuhr Logic: 11:xx is AM. 12:xx is PM. 01:xx is PM.
      if (dH === 12 || dH < 11) {
        dhuhrFinal = to24Hour(dailyData.dhuhr, true);
      } else {
        dhuhrFinal = to24Hour(dailyData.dhuhr, false);
      }

      return {
        day: ramadanDay,
        date: targetDate,
        fajr: fajr24,
        dhuhr: dhuhrFinal,
        asr: to24Hour(dailyData.asr, true),
        maghrib: to24Hour(dailyData.maghrib, true),
        isha: to24Hour(dailyData.isha, true),
        iftarTime: to24Hour(dailyData.maghrib, true),
      };
    }
  }

  // Fallback
  return getPrayerTimesForCity(city)[0];
}
