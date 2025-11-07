# 🜂 MyOriCode · Canon 7.7 Revision A  
### Eight Constitution Medicine · React / Next.js (Vercel Edition)

This repository implements **Canon 7.7 Revision A** — the official MyOriCode ECM (Eight Constitution Medicine) analyzer — in a modern **TypeScript + React (Next 14 App Router)** environment.

It provides:
- ✅ **Full Canon 7.7 Rev A engine** (`lib/canon77_revA.ts`)  
- ✅ **Edge-safe API endpoint** (`app/api/canon77/route.ts`)  
- ✅ **Interactive React runner** (`components/CanonRunner.tsx`)  
- ✅ **Demo page** at `/canon` for local or production use  
- ✅ **Client-agnostic JSON + Markdown outputs** ready for the Universal Constitutional Analyzer (UCA)

---

## 🧩 Project Overview

| Layer | Purpose |
|-------|----------|
| `lib/canon77_revA.ts` | Core analyzer. Pure TypeScript, zero dependencies. Converts BaZi pillars into ECM constitution using Dr Kuon’s Canon 7.7 Revision A (structural confidence only). |
| `app/api/canon77/route.ts` | Serverless POST endpoint. Accepts `{ pillars }` payload, returns `{ json, markdown }`. Runs on the Edge Runtime. |
| `components/CanonRunner.tsx` | Client component for entering pillars, running Canon, and viewing results (JSON, tables, markdown). |
| `app/canon/page.tsx` | Page mounting the runner. Access via `http://localhost:3000/canon`. |

---

## ⚙️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/myoricode-canon77.git
   cd myoricode-canon77
