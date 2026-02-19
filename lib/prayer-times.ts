export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getTimeUntilString(timeStr: string): TimeRemaining {
  const now = new Date();
  const targetMinutes = timeStringToMinutes(timeStr);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  let diffMinutes = targetMinutes - currentMinutes;
  let diffSeconds = 0 - currentSeconds;

  if (diffSeconds < 0) {
    diffMinutes -= 1;
    diffSeconds += 60;
  }

  if (diffMinutes < 0) {
    // Time has passed for today, calculate for next day
    diffMinutes += 24 * 60;
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return {
    hours,
    minutes,
    seconds: diffSeconds,
  };
}

export function formatTimeRemaining(time: TimeRemaining): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
}

export function getNextPrayerTime(
  prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }
): { name: string; time: string } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const prayerMinutes = timeStringToMinutes(prayer.time);
    if (prayerMinutes > currentMinutes) {
      return prayer;
    }
  }

  // If no prayer found today, return Fajr (next day)
  return { name: "Fajr", time: prayerTimes.fajr };
}
