// Target coordinates for geolocation verification (Monas, Jakarta)
export const TARGET_COORDS = {
  lat: -6.1754,
  lng: 106.8272,
};

// Radius in meters - untuk prototype gunakan nilai besar agar tidak terikat lokasi
// Bisa diatur via .env: NEXT_PUBLIC_TARGET_RADIUS (dalam meter)
// Default 50 km = 50000 m (prototype friendly)
const envRadius = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_TARGET_RADIUS;
export const LOCATION_RADIUS_M = envRadius ? Number(envRadius) : 50_000;

// Total levels in the map
export const TOTAL_LEVELS = 5;
