# Ramadan Calendar (Bangladesh) – AlAdhan API Extraction Guide

This document defines the exact strategy to fetch, filter, and transform data
from the AlAdhan API into a clean Ramadan calendar JSON format.

Final output format (for each day):

```json
{
  "day": 1,
  "gregorian": "2026-02-19",
  "weekday_bn": "বৃহস্পতিবার",
  "sehri_end": "05:12",
  "iftar": "17:58"
}
```

## 1. API Endpoint

Use AlAdhan Monthly Calendar API:

https://api.aladhan.com/v1/calendarByCity

Required query parameters:

- city → e.g., Dhaka
- country → Bangladesh
- month → Gregorian month (1–12)
- year → Gregorian year
- method → calculation method (keep consistent, e.g., 2)

Example:

```
https://api.aladhan.com/v1/calendarByCity?city=Dhaka&country=Bangladesh&month=3&year=2026&method=2
```

## 2. Important Response Fields

The API returns:

{
"code": 200,
"status": "OK",
"data": [ ... ]
}

Each item in data[] represents one Gregorian day.

We only need:

A) From timings:

- timings.Fajr → Sehri end
- timings.Maghrib → Iftar

Example:
"Fajr": "05:19 (+06)"
"Maghrib": "18:01 (+06)"

IMPORTANT:
Remove timezone suffix.
Keep only HH:MM.
Example:
"05:19 (+06)" → "05:19"

---

B) From date:

- date.gregorian.date → "01-03-2026"
- date.gregorian.weekday.en → "Sunday"
- date.hijri.month.number → 9
- date.hijri.day → Ramadan day number

---

## 3. Ramadan Filtering Rule

Keep only entries where:

date.hijri.month.number === 9

Why?
Hijri month 9 = Ramadan.
Hijri month 10 = Shawwal (must exclude).

---

## 4. Month Fetching Strategy

Ramadan may span two Gregorian months.

Example (2026 Bangladesh):
Ramadan starts 19 Feb 2026.

So:

1. Fetch February 2026
2. Fetch March 2026
3. Merge both month arrays
4. Filter Hijri month number === 9
5. Sort by Gregorian date ascending
6. Assign sequential day numbers starting from 1

This ensures complete Ramadan coverage.

---

## 5. Data Transformation Rules

### A) Gregorian Date Conversion

API format:
"01-03-2026" (DD-MM-YYYY)

Convert to ISO:
"2026-03-01" (YYYY-MM-DD)

---

### B) English Weekday → Bangla Weekday Mapping

Use this mapping:

Sunday → রবিবার
Monday → সোমবার
Tuesday → মঙ্গলবার
Wednesday → বুধবার
Thursday → বৃহস্পতিবার
Friday → শুক্রবার
Saturday → শনিবার

---

### C) Sehri End

From:
timings.Fajr

Remove "(+06)" and keep only HH:MM.

---

### D) Iftar

From:
timings.Maghrib

Remove "(+06)" and keep only HH:MM.

---

## 6. Final Output Object Structure

Each Ramadan day must be:

{
"day": 1,
"gregorian": "2026-02-19",
"weekday_bn": "বৃহস্পতিবার",
"sehri_end": "05:12",
"iftar": "17:58"
}

Rules:

- "day" is sequential (1..29/30)
- "gregorian" must be ISO format
- "weekday_bn" must be converted from English
- "sehri_end" = Fajr (trimmed)
- "iftar" = Maghrib (trimmed)

---

## 7. Validation Checklist

Before exporting final JSON:

✔ All entries must have hijri.month.number === 9
✔ No "(+06)" remains in time fields
✔ Dates are ISO formatted
✔ Weekday correctly translated to Bangla
✔ Day numbering starts from 1 and increments properly
✔ Total count is 29 or 30

---

End of specification.

```

```
