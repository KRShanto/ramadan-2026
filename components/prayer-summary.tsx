'use client';

import { DailyPrayerTimes } from '@/lib/prayer-data';
import { getNextPrayerTime } from '@/lib/prayer-times';

interface PrayerSummaryProps {
  prayers: DailyPrayerTimes;
}

export function PrayerSummary({ prayers }: PrayerSummaryProps) {
  const nextPrayer = getNextPrayerTime({
    fajr: prayers.fajr,
    dhuhr: prayers.dhuhr,
    asr: prayers.asr,
    maghrib: prayers.maghrib,
    isha: prayers.isha,
  });

  const prayersList = [
    { name: 'ফজর', englishName: 'Fajr', time: prayers.fajr, next: nextPrayer.name === 'Fajr' },
    { name: 'যোহর', englishName: 'Dhuhr', time: prayers.dhuhr, next: nextPrayer.name === 'Dhuhr' },
    { name: 'আসর', englishName: 'Asr', time: prayers.asr, next: nextPrayer.name === 'Asr' },
    { name: 'মাগরিব', englishName: 'Maghrib', time: prayers.maghrib, next: nextPrayer.name === 'Maghrib' },
    { name: 'ইশা', englishName: 'Isha', time: prayers.isha, next: nextPrayer.name === 'Isha' },
  ];

  return (
    <div className="premium-card p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">আজকের নামাজের সময়</h2>
      
      <div className="space-y-3">
        {prayersList.map((prayer) => (
          <div
            key={prayer.englishName}
            className={`flex justify-between items-center px-6 py-4 rounded-xl transition-all duration-200 ${
              prayer.next
                ? 'bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/50 shadow-lg shadow-primary/10'
                : 'bg-secondary/50 border border-border/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-lg font-semibold ${
                prayer.next ? 'text-primary' : 'text-foreground'
              }`}>
                {prayer.name}
              </span>
              {prayer.next && (
                <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium">
                  পরবর্তী
                </span>
              )}
            </div>
            <span className={`font-mono font-semibold ${
              prayer.next ? 'text-primary text-lg' : 'text-muted-foreground'
            }`}>
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
