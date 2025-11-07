// lib/canon77_revA.ts
export type Pillars = {
  year: { stem: string; branch: string };
  month:{ stem: string; branch: string };
  day:  { stem: string; branch: string };
  hour: { stem: string; branch: string };
};

// ... paste the full TypeScript analyzer from my previous message ...

export function analyzeCanon77(pillars: Pillars): { json: any; markdown: string } {
  // ... full logic exactly as provided earlier ...
}
