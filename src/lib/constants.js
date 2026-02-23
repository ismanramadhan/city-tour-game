// Target coordinates for geolocation verification (Monas, Jakarta)
export const TARGET_COORDS = {
  lat: -6.92177964567858,
  lng: 107.60707516595137
};

// Use TARGET_COORDS for all levels (ignore per-level coords from levels.json).
// Set NEXT_PUBLIC_USE_GLOBAL_TARGET=true in .env when testing from one location.
export const USE_GLOBAL_TARGET =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USE_GLOBAL_TARGET === "false";

// Radius in meters - untuk prototype gunakan nilai besar agar tidak terikat lokasi
// Bisa diatur via .env: NEXT_PUBLIC_TARGET_RADIUS (dalam meter)
// Default 50 km = 50000 m (prototype friendly)
const envRadius = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_TARGET_RADIUS;
export const LOCATION_RADIUS_M = envRadius ? Number(envRadius) : 500_000;

// Total levels in the map
export const TOTAL_LEVELS = 5;
