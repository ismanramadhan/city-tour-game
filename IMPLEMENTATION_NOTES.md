# City Tour Game - Implementation Notes

## Perubahan dari Spesifikasi Awal

### AR.js → Location-Based Challenge

**Alasan perubahan:**
- User request: Tidak ingin scan Hiro Marker
- Tantangan keluar berdasarkan geolokasi (latitude & longitude)
- Untuk prototype: geolokasi sebagai informasi untuk investor

**Implementasi saat ini:**
- `LocationBasedChallenge.jsx` menggantikan `ARScanner.jsx`
- Menampilkan koordinat user (lat/lng) secara real-time
- Informasi untuk investor tentang konsep location-based challenges
- Tidak ada dependency AR.js atau A-Frame

### AR.js Cleanup Utilities (Future Reference)

File `src/lib/arCleanup.js` dibuat untuk referensi jika AR.js digunakan kembali di masa depan. File ini berisi:

1. **`cleanupARScene(sceneId)`** - Membersihkan AR scene dengan benar:
   - Stop video streams (webcam)
   - Remove event listeners
   - Pause rendering loop
   - Remove dari DOM
   - Cleanup A-Frame systems

2. **`generateARSceneId()`** - Generate unique ID untuk mencegah duplicate canvas

3. **`isARJSLoaded()`** - Check apakah AR.js scripts sudah loaded

**Best practices untuk AR.js:**
- Selalu gunakan unique ID untuk `<a-scene>`
- Cleanup di `useEffect` return function
- Stop video tracks sebelum unmount
- Remove event listeners untuk mencegah memory leaks

## Fitur Audio

### Web Audio API
File `src/lib/audio.js` menggunakan Web Audio API untuk generate suara:
- **`playClickSound()`** - Suara klik pleasant (C5 note)
- **`playLockedSound()`** - Suara "denied" untuk node terkunci
- Lazy initialization AudioContext
- Graceful fallback jika audio tidak didukung

## Parallax Scroll

### Framer Motion Implementation
- `useScroll` untuk tracking scroll progress
- `useTransform` untuk mapping scroll ke Y position
- Multiple parallax layers dengan kecepatan berbeda:
  - Background: 30% slower
  - Path & nodes: 10% slower
- Native smooth scrolling dengan `scrollBehavior: "smooth"`

## Struktur Komponen

```
src/
├── app/
│   ├── page.js              # Login page
│   ├── map/page.js          # Saga map (protected)
│   └── level/[id]/page.js   # Challenge selection
├── components/
│   ├── SagaMap.jsx          # Map dengan parallax & audio
│   ├── LocationModal.jsx    # Geolocation verification
│   ├── LocationBasedChallenge.jsx  # Location-based challenge (replaces AR)
│   └── Trivia.jsx           # Quiz challenge
├── contexts/
│   └── AuthContext.jsx      # Mock authentication
└── lib/
    ├── audio.js             # Web Audio API utilities
    ├── arCleanup.js         # AR.js cleanup (future reference)
    ├── auth.js              # Mock auth functions
    ├── constants.js         # Target coords & config
    └── geolocation.js       # Haversine distance calculation
```

## Tech Stack

- **Next.js 16** - App Router
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations & parallax
- **Lucide React** - Icons
- **Web Audio API** - Sound effects
- **Geolocation API** - Location verification

## Testing Notes

### Geolocation Testing
- Target: Monas, Jakarta (-6.1754, 106.8272)
- Radius: 500 meters
- Mock location dapat digunakan di browser DevTools

### Audio Testing
- Audio memerlukan user interaction untuk play (browser policy)
- Fallback gracefully jika AudioContext tidak tersedia

## Future Enhancements

1. **AR.js Integration** - Jika diperlukan, gunakan utilities di `arCleanup.js`
2. **Dynamic Challenges** - Load challenges dari API berdasarkan koordinat
3. **Offline Support** - Service Worker untuk offline gameplay
4. **Analytics** - Track user location patterns dan completion rates
