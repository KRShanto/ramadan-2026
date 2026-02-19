import { differenceInSeconds, set, addDays, isAfter } from "date-fns";

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export function getTimeUntilString(timeStr: string): TimeRemaining {
  const now = new Date();
  const [targetHours, targetMinutes] = timeStr.split(":").map(Number);

  let targetTime = set(now, {
    hours: targetHours,
    minutes: targetMinutes,
    seconds: 0,
    milliseconds: 0,
  });

  // If target time has already passed today, calculate for tomorrow
  if (isAfter(now, targetTime)) {
    targetTime = addDays(targetTime, 1);
  }

  // Add seconds handling manually since intervalToDuration doesn't return seconds difference precisely if not exact
  // A better approach with date-fns for exact countdown is to use differenceInSeconds and format it
  const diffInSeconds = differenceInSeconds(targetTime, now);

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
  };
}

export function formatTimeRemaining(time: TimeRemaining): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
}

export function getNextPrayerTime(prayerTimes: {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): { name: string; time: string } {
  const now = new Date();

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(":").map(Number);
    const prayerTime = set(now, { hours: h, minutes: m, seconds: 0 });

    if (isAfter(prayerTime, now)) {
      return prayer;
    }
  }

  // If no prayer found today, return Fajr (next day)
  return { name: "Fajr", time: prayerTimes.fajr };
}
