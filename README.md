# BaZi Four Pillars Calculator - Fresh Start

A clean, modern React + TypeScript application for calculating BaZi (Four Pillars of Destiny) using accurate timezone detection and DST handling.

## Features

- **Accurate Timezone Detection**: Uses `geo-tz` library for political boundary-based timezone detection
- **Automatic DST Handling**: Uses Luxon to automatically detect and adjust for Daylight Saving Time
- **Solar Time Correction**: Calculates accurate solar time based on longitude
- **Free Geocoding**: Uses OpenStreetMap's Nominatim API (no API key required)
- **Clean Modern UI**: Simple, responsive React interface

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React 18
- TypeScript
- Vite (build tool)
- Luxon (timezone handling)
- geo-tz (timezone detection)

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project Structure

```
bazi-fresh/
├── src/
│   ├── core/
│   │   └── bazi.ts          # Core BaZi calculation logic
│   ├── components/
│   │   ├── BaziForm.tsx     # Input form component
│   │   └── BaziResults.tsx  # Results display component
│   ├── App.tsx              # Main app component
│   └── main.tsx             # React entry point
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite config
```

## How to Use

1. Enter the person's name
2. Select date of birth
3. Enter time of birth (24-hour format)
4. Enter place of birth (include city and country, e.g., "Mumbai, India")
5. Click "Calculate BaZi"

The app will:
- Geocode the location to get accurate coordinates
- Detect the timezone using political boundaries
- Automatically detect and adjust for DST
- Calculate solar time correction
- Compute the Four Pillars
- Display the complete BaZi chart with analysis

## API Used

- **OpenStreetMap Nominatim**: Free geocoding API (no key required)
- Rate limit: Please be respectful with API calls

## Technologies

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe code
- **Vite**: Fast build tool
- **Luxon**: DateTime handling with timezone support
- **geo-tz**: Accurate timezone detection from coordinates

## Notes

- The calculation uses Jaguang Sunim's verified BaZi method
- DST is automatically detected and applied
- Solar time correction is based on longitude
- All console logs are available for debugging

## License

Educational/Research Use
