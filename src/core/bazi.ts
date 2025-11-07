/**
 * BaZi Calculator Module for TypeScript/React
 * Calculates Four Pillars of Destiny (八字) using Jaguang Sunim's verified method
 * With Luxon for DST + Geocoding + tz-lookup for accurate timezone detection
 * 
 * ACCURATE VERSION - Uses @photostructure/tz-lookup (browser-compatible)
 */
import { DateTime } from 'luxon';
import { default as tzlookup } from '@photostructure/tz-lookup';

// Heavenly Stems (天干)
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const STEMS_ENGLISH = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
export const STEMS_ELEMENT = [
  'Yang Wood', 'Yin Wood', 'Yang Fire', 'Yin Fire', 'Yang Earth',
  'Yin Earth', 'Yang Metal', 'Yin Metal', 'Yang Water', 'Yin Water'
];

// Earthly Branches (地支)
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const BRANCHES_ENGLISH = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
export const BRANCHES_ELEMENT = [
  'Yang Water', 'Yin Earth', 'Yang Wood', 'Yin Wood', 'Yang Earth', 'Yin Fire',
  'Yang Fire', 'Yin Earth', 'Yang Metal', 'Yin Metal', 'Yang Earth', 'Yin Water'
];
export const BRANCHES_ANIMAL = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Reference point for day pillar calculation
const REFERENCE_JDN = 2423821; // February 5, 1924 = 甲子
const BRANCH_OFFSET = 2;

// Cache for geocoding results
const geocodeCache = new Map<string, GeocodeResult>();

// Built-in coordinates for common cities
const CITY_COORDINATES: { [key: string]: { lat: number; lon: number; timezone: string; displayName: string } } = {
  'new york': { lat: 40.7128, lon: -74.0060, timezone: 'America/New_York', displayName: 'New York, NY, USA' },
  'los angeles': { lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles', displayName: 'Los Angeles, CA, USA' },
  'chicago': { lat: 41.8781, lon: -87.6298, timezone: 'America/Chicago', displayName: 'Chicago, IL, USA' },
  'san francisco': { lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', displayName: 'San Francisco, CA, USA' },
  'london': { lat: 51.5074, lon: -0.1278, timezone: 'Europe/London', displayName: 'London, UK' },
  'paris': { lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris', displayName: 'Paris, France' },
  'berlin': { lat: 52.5200, lon: 13.4050, timezone: 'Europe/Berlin', displayName: 'Berlin, Germany' },
  'moscow': { lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow', displayName: 'Moscow, Russia' },
  'tokyo': { lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo', displayName: 'Tokyo, Japan' },
  'beijing': { lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai', displayName: 'Beijing, China' },
  'shanghai': { lat: 31.2304, lon: 121.4737, timezone: 'Asia/Shanghai', displayName: 'Shanghai, China' },
  'hong kong': { lat: 22.3193, lon: 114.1694, timezone: 'Asia/Hong_Kong', displayName: 'Hong Kong' },
  'singapore': { lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore', displayName: 'Singapore' },
  'seoul': { lat: 37.5665, lon: 126.9780, timezone: 'Asia/Seoul', displayName: 'Seoul, South Korea' },
  'mumbai': { lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata', displayName: 'Mumbai, India' },
  'delhi': { lat: 28.7041, lon: 77.1025, timezone: 'Asia/Kolkata', displayName: 'Delhi, India' },
  'dubai': { lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai', displayName: 'Dubai, UAE' },
  'sydney': { lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney', displayName: 'Sydney, Australia' },
  'toronto': { lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto', displayName: 'Toronto, Canada' },
  'vancouver': { lat: 49.2827, lon: -123.1207, timezone: 'America/Vancouver', displayName: 'Vancouver, Canada' },
};

// Types
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
  timezone: string;
}

export interface PersonalInfo {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  locationDisplayName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDST: boolean;
  timezone: string;
  solarTime: string;
  solarCorrection: number;
}

export interface PillarElement {
  chinese: string;
  english: string;
  element: string;
}

export interface PillarBranch extends PillarElement {
  animal: string;
}

export interface Pillar {
  stem: PillarElement;
  branch: PillarBranch;
}

export interface Chart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface ElementDetail {
  character: string;
  type: 'stem' | 'branch';
  pillar: string;
  fullElement: string;
}

export interface Analysis {
  personalElement: PillarElement;
  elements: Record<string, number>;
  elementDetails: Record<string, ElementDetail[]>;
  constitution: string;
}

export interface BaziResult {
  personalInfo: PersonalInfo;
  chart: Chart;
  analysis: Analysis;
}

/**
 * Get accurate timezone from coordinates using tz-lookup library
 * This uses political boundaries, not just longitude approximation
 * Browser-compatible alternative to geo-tz
 */
function getTimezoneFromCoordinates(lat: number, lon: number): string {
  try {
    const timezone = tzlookup(lat, lon);
    if (timezone) {
      console.log(`✅ Timezone detected: ${timezone} (${lat.toFixed(4)}°, ${lon.toFixed(4)}°)`);
      return timezone;
    }
    console.warn('⚠️ No timezone found, defaulting to UTC');
    return 'UTC';
  } catch (error) {
    console.error('Timezone lookup error:', error);
    return 'UTC';
  }
}

/**
 * Geocode location using built-in cities or Nominatim (OpenStreetMap) API
 * Free, no API key required, worldwide coverage
 */
async function geocodeLocation(location: string): Promise<GeocodeResult | null> {
  // Check cache first
  const cacheKey = location.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    console.log(`💾 Using cached location data for: ${location}`);
    return geocodeCache.get(cacheKey)!;
  }

  // Check built-in cities
  const cityKey = cacheKey.split(',')[0].trim();
  if (CITY_COORDINATES[cityKey]) {
    const city = CITY_COORDINATES[cityKey];
    const result: GeocodeResult = {
      latitude: city.lat,
      longitude: city.lon,
      displayName: city.displayName,
      timezone: city.timezone
    };
    geocodeCache.set(cacheKey, result);
    console.log(`✅ Found built-in city: ${city.displayName}`);
    return result;
  }

  try {
    console.log(`🌍 Geocoding: ${location}...`);
    
    // Nominatim API - free, no API key needed
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(location)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BaZi-Calculator/2.0 (Educational/Research)'
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ Geocoding API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      
      // Get timezone using approximation
      const timezone = getTimezoneFromCoordinates(lat, lon);
      
      const result: GeocodeResult = {
        latitude: lat,
        longitude: lon,
        displayName: data[0].display_name,
        timezone: timezone
      };

      // Cache the result
      geocodeCache.set(cacheKey, result);

      console.log(`✅ Geocoded: ${location}`);
      console.log(`   → ${result.displayName}`);
      console.log(`   → ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
      console.log(`   → Timezone: ${result.timezone}`);

      return result;
    }

    console.warn(`⚠️ Location not found: ${location}`);
    return null;
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return null;
  }
}

/**
 * Calculate solar time correction based on longitude
 */
function calculateSolarCorrection(longitude: number, utcOffset: number): number {
  const standardMeridian = utcOffset * 15;
  return (longitude - standardMeridian) * 4;
}

/**
 * Detect DST using Luxon's timezone database
 */
function detectDST(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
): { isDST: boolean; hoursToSubtract: number; effectiveUtcOffset: number; standardOffset: number } {
  try {
    const dt = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: timezone }
    );

    if (!dt.isValid) {
      console.error(`❌ Invalid date/time: ${dt.invalidReason}`);
      return { isDST: false, hoursToSubtract: 0, effectiveUtcOffset: 0, standardOffset: 0 };
    }

    const isDST = dt.isInDST;
    const effectiveUtcOffset = dt.offset / 60; // Convert minutes to hours

    // Get standard (non-DST) offset by checking January
    const standardDt = DateTime.fromObject(
      { year, month: 1, day: 1, hour: 12 },
      { zone: timezone }
    );
    const standardOffset = standardDt.offset / 60;

    const hoursToSubtract = isDST ? (effectiveUtcOffset - standardOffset) : 0;

    console.log(`⏰ DST Detection:`);
    console.log(`   → DST in effect: ${isDST ? 'Yes' : 'No'}`);
    console.log(`   → UTC offset: ${effectiveUtcOffset > 0 ? '+' : ''}${effectiveUtcOffset}`);
    if (isDST) {
      console.log(`   → Adjusting by: -${hoursToSubtract} hour(s)`);
    }

    return { isDST, hoursToSubtract, effectiveUtcOffset, standardOffset };
  } catch (error) {
    console.error('❌ DST detection error:', error);
    return { isDST: false, hoursToSubtract: 0, effectiveUtcOffset: 0, standardOffset: 0 };
  }
}

/**
 * Calculate Julian Day Number for a given date
 */
function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Calculate year pillar
 */
function getYearPillar(year: number, month: number, day: number): [number, number] {
  let chineseYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    chineseYear -= 1;
  }

  const yearsSince1924 = chineseYear - 1924;
  const stem = ((yearsSince1924 % 10) + 10) % 10;
  const branch = ((yearsSince1924 % 12) + 12) % 12;

  return [stem, branch];
}

/**
 * Calculate month pillar based on solar terms
 */
function getMonthPillar(_year: number, month: number, day: number, yearStem: number): [number, number] {
  const solarTerms: [number, number, number][] = [
    [2, 4, 2], [3, 6, 3], [4, 5, 4], [5, 6, 5], [6, 6, 6], [7, 7, 7],
    [8, 8, 8], [9, 8, 9], [10, 8, 10], [11, 7, 11], [12, 7, 0], [1, 6, 1],
  ];

  let monthBranch = 2;
  for (const [m, d, b] of solarTerms) {
    if (month < m || (month === m && day < d)) {
      break;
    }
    monthBranch = b;
  }

  const baseStemForYin = (yearStem * 2 + 2) % 10;
  const monthStem = (baseStemForYin + (monthBranch - 2)) % 10;

  return [monthStem, monthBranch];
}

/**
 * Calculate day pillar
 */
function getDayPillar(solarDate: { year: number; month: number; day: number; hour: number }): [number, number] {
  let jdn = julianDayNumber(solarDate.year, solarDate.month, solarDate.day);
  
  if (solarDate.hour >= 23) {
    jdn += 1;
  }

  const daysSinceRef = jdn - REFERENCE_JDN;
  const stem = ((daysSinceRef % 10) + 10) % 10;
  const branch = ((daysSinceRef + BRANCH_OFFSET) % 12 + 12) % 12;

  return [stem, branch];
}

/**
 * Calculate hour pillar
 */
function getHourPillar(dayStem: number, solarHour: number): [number, number] {
  const hourBranch = (Math.floor((solarHour + 1) / 2)) % 12;
  const stemBases = [0, 2, 4, 6, 8];
  const hourStem = (stemBases[dayStem % 5] + hourBranch) % 10;

  return [hourStem, hourBranch];
}

/**
 * Count elements in the BaZi chart
 */
function countElements(chart: Record<string, [number, number]>): {
  elements: Record<string, number>;
  elementDetails: Record<string, ElementDetail[]>;
} {
  const elements: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const elementDetails: Record<string, ElementDetail[]> = { 
    Wood: [], Fire: [], Earth: [], Metal: [], Water: [] 
  };

  const pillars = ['hour', 'day', 'month', 'year'];

  for (const pillar of pillars) {
    const [stem, branch] = chart[pillar];

    const stemElement = STEMS_ELEMENT[stem].split(' ')[1];
    elements[stemElement] += 1;
    elementDetails[stemElement].push({
      character: STEMS[stem],
      type: 'stem',
      pillar: pillar,
      fullElement: STEMS_ELEMENT[stem]
    });

    const branchElement = BRANCHES_ELEMENT[branch].split(' ')[1];
    elements[branchElement] += 1;
    elementDetails[branchElement].push({
      character: BRANCHES[branch],
      type: 'branch',
      pillar: pillar,
      fullElement: BRANCHES_ELEMENT[branch]
    });
  }

  return { elements, elementDetails };
}

/**
 * Determine body constitution
 */
function determineConstitution(elementCounts: Record<string, number>): string {
  const fire = elementCounts.Fire || 0;
  const water = elementCounts.Water || 0;
  const earth = elementCounts.Earth || 0;

  if (fire >= 4 || (fire >= 3 && water <= 1)) {
    return 'Lesser Yang';
  } else if (water >= 4 || (water >= 3 && fire <= 1)) {
    return 'Lesser Yin';
  } else if (earth <= 1 && water >= 3) {
    return 'Lesser Yin';
  } else if (water >= fire) {
    return 'Lesser Yin';
  } else {
    return 'Lesser Yang';
  }
}

/**
 * Main BaZi calculation function (ASYNC - requires geocoding)
 * 
 * @param name - Person's name
 * @param dateOfBirth - Date in 'YYYY-MM-DD' format
 * @param timeOfBirth - Time in 'HH:MM' format (24-hour, local time)
 * @param placeOfBirth - Location (city, country - e.g., "Mumbai, India")
 * @param isDST - Optional manual DST override (null = auto-detect)
 * @returns Promise<BaziResult> - Complete BaZi calculation
 */
export async function calculateBazi(
  name: string,
  dateOfBirth: string,
  timeOfBirth: string,
  placeOfBirth: string,
  isDST: boolean | null = null
): Promise<BaziResult> {
  console.log('\n' + '='.repeat(60));
  console.log(`🔮 CALCULATING BAZI FOR: ${name}`);
  console.log('='.repeat(60));

  // Parse date and time
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  let [hour, minute] = timeOfBirth.split(':').map(Number);

  // Geocode location to get accurate coordinates and timezone
  const locationData = await geocodeLocation(placeOfBirth);
  if (!locationData) {
    throw new Error(
      `Could not find location: "${placeOfBirth}". ` +
      `Please check spelling or try adding country (e.g., "Mumbai, India")`
    );
  }

  let dstApplied = false;
  let effectiveUtcOffset = 0;
  let standardOffset = 0;

  // Auto-detect DST if not manually specified
  if (isDST === null) {
    const dstInfo = detectDST(year, month, day, hour, minute, locationData.timezone);
    dstApplied = dstInfo.isDST;
    effectiveUtcOffset = dstInfo.effectiveUtcOffset;
    standardOffset = dstInfo.standardOffset || effectiveUtcOffset;

    if (dstInfo.isDST && dstInfo.hoursToSubtract) {
      console.log(`⚙️ Adjusting time for DST: ${hour}:${String(minute).padStart(2, '0')} → ${hour - dstInfo.hoursToSubtract}:${String(minute).padStart(2, '0')}`);
      hour -= dstInfo.hoursToSubtract;
      if (hour < 0) {
        hour += 24;
      }
    }
  } else if (isDST) {
    // Manual DST adjustment
    dstApplied = true;
    hour -= 1;
    if (hour < 0) {
      hour += 24;
    }
  }

  // Use standard offset for solar correction
  const utcOffsetForCalculation = standardOffset || effectiveUtcOffset;
  const solarCorrection = calculateSolarCorrection(locationData.longitude, utcOffsetForCalculation);
  console.log(`☀️ Solar correction: ${solarCorrection > 0 ? '+' : ''}${solarCorrection.toFixed(1)} minutes`);

  // Calculate solar time
  let solarMinute = minute + solarCorrection;
  let solarHour = hour;

  if (solarMinute >= 60) {
    solarHour += Math.floor(solarMinute / 60);
    solarMinute = solarMinute % 60;
  } else if (solarMinute < 0) {
    solarHour -= Math.ceil(Math.abs(solarMinute) / 60);
    solarMinute = 60 + (solarMinute % 60);
  }

  if (solarHour >= 24) {
    solarHour = solarHour % 24;
  } else if (solarHour < 0) {
    solarHour = 24 + (solarHour % 24);
  }

  const solarDate = {
    year,
    month,
    day,
    hour: solarHour,
    minute: Math.round(solarMinute)
  };

  console.log(`🕐 Solar time: ${String(solarDate.hour).padStart(2, '0')}:${String(solarDate.minute).padStart(2, '0')}`);
  console.log('');

  // Calculate Four Pillars
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(year, month, day, yearPillar[0]);
  const dayPillar = getDayPillar(solarDate);
  const hourPillar = getHourPillar(dayPillar[0], solarDate.hour);

  const chart = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };

  const { elements, elementDetails } = countElements(chart);
  const constitution = determineConstitution(elements);

  console.log('✅ BaZi calculation complete!');
  console.log('='.repeat(60) + '\n');

  return {
    personalInfo: {
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      locationDisplayName: locationData.displayName,
      coordinates: {
        latitude: locationData.latitude,
        longitude: locationData.longitude
      },
      isDST: dstApplied,
      timezone: locationData.timezone,
      solarTime: `${String(solarDate.hour).padStart(2, '0')}:${String(solarDate.minute).padStart(2, '0')}`,
      solarCorrection: Math.round(solarCorrection * 10) / 10
    },
    chart: {
      year: {
        stem: {
          chinese: STEMS[yearPillar[0]],
          english: STEMS_ENGLISH[yearPillar[0]],
          element: STEMS_ELEMENT[yearPillar[0]]
        },
        branch: {
          chinese: BRANCHES[yearPillar[1]],
          english: BRANCHES_ENGLISH[yearPillar[1]],
          element: BRANCHES_ELEMENT[yearPillar[1]],
          animal: BRANCHES_ANIMAL[yearPillar[1]]
        }
      },
      month: {
        stem: {
          chinese: STEMS[monthPillar[0]],
          english: STEMS_ENGLISH[monthPillar[0]],
          element: STEMS_ELEMENT[monthPillar[0]]
        },
        branch: {
          chinese: BRANCHES[monthPillar[1]],
          english: BRANCHES_ENGLISH[monthPillar[1]],
          element: BRANCHES_ELEMENT[monthPillar[1]],
          animal: BRANCHES_ANIMAL[monthPillar[1]]
        }
      },
      day: {
        stem: {
          chinese: STEMS[dayPillar[0]],
          english: STEMS_ENGLISH[dayPillar[0]],
          element: STEMS_ELEMENT[dayPillar[0]]
        },
        branch: {
          chinese: BRANCHES[dayPillar[1]],
          english: BRANCHES_ENGLISH[dayPillar[1]],
          element: BRANCHES_ELEMENT[dayPillar[1]],
          animal: BRANCHES_ANIMAL[dayPillar[1]]
        }
      },
      hour: {
        stem: {
          chinese: STEMS[hourPillar[0]],
          english: STEMS_ENGLISH[hourPillar[0]],
          element: STEMS_ELEMENT[hourPillar[0]]
        },
        branch: {
          chinese: BRANCHES[hourPillar[1]],
          english: BRANCHES_ENGLISH[hourPillar[1]],
          element: BRANCHES_ELEMENT[hourPillar[1]],
          animal: BRANCHES_ANIMAL[hourPillar[1]]
        }
      }
    },
    analysis: {
      personalElement: {
        chinese: STEMS[dayPillar[0]],
        english: STEMS_ENGLISH[dayPillar[0]],
        element: STEMS_ELEMENT[dayPillar[0]]
      },
      elements,
      elementDetails,
      constitution
    }
  };
}
