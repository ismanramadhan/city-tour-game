# 🗺️ City Tour Game - Prototype

Prototype Web-Based City Tour Game dengan fitur geolocation-based challenges, saga map bergaya Candy Crush, dan mini games interaktif.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055)

## ✨ Fitur Utama

### 1. 🔐 Authentication Mockup
- Halaman login dengan UI bergaya NextAuth
- Mock authentication (tidak perlu akun Google asli)
- Session management dengan localStorage

### 2. 🗺️ Saga Map (Candy Crush Style)
- Map vertikal dengan path penghubung antar level
- 5 level dengan sistem unlock progresif
- Animasi smooth dengan Framer Motion
- **Parallax scroll effect** untuk depth visual
- **Efek suara klik** pada setiap node (Web Audio API)

### 3. 📍 Geolocation Guard
- Modal "Verifikasi Lokasi" sebelum masuk tantangan
- Validasi radius 500m dari target (Monas, Jakarta)
- Menggunakan Navigator Geolocation API
- Haversine formula untuk kalkulasi jarak

### 4. 🎮 Mini Games

#### Tantangan Berbasis Lokasi
- Menampilkan koordinat user (lat/lng) real-time
- Informasi untuk investor tentang konsep location-based challenges
- Demonstrasi penggunaan geolokasi dalam gameplay

#### Trivia Heritage
- 3 pertanyaan pilihan ganda tentang sejarah Jakarta
- Sistem scoring dengan feedback visual
- Progress bar dan animasi transisi

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/[username]/city-tour-game.git
cd city-tour-game

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📱 Testing

### Login
1. Klik tombol "Login with Google" (mockup - tidak perlu akun asli)
2. Otomatis redirect ke Saga Map

### Geolocation Testing
- **Target lokasi**: Monas, Jakarta (-6.1754, 106.8272)
- **Radius**: 500 meter
- **Mock location**: Gunakan Chrome DevTools → Sensors → Location

### Audio Testing
- Klik node unlocked → suara klik pleasant
- Klik node locked → suara "denied"
- Audio memerlukan user interaction (browser policy)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Audio**: Web Audio API
- **Geolocation**: Navigator Geolocation API

## 📁 Struktur Project

```
city-tour-game/
├── src/
│   ├── app/
│   │   ├── page.js              # Login page
│   │   ├── map/page.js          # Saga map (protected)
│   │   └── level/[id]/page.js   # Challenge selection
│   ├── components/
│   │   ├── SagaMap.jsx          # Map dengan parallax & audio
│   │   ├── LocationModal.jsx    # Geolocation verification
│   │   ├── LocationBasedChallenge.jsx
│   │   └── Trivia.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx      # Mock authentication
│   └── lib/
│       ├── audio.js             # Web Audio utilities
│       ├── auth.js              # Mock auth functions
│       ├── constants.js         # Config & target coords
│       └── geolocation.js       # Distance calculation
├── public/                      # Static assets
└── package.json
```

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/[username]/city-tour-game)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

### Manual Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## 🎯 Untuk Investor

Prototype ini mendemonstrasikan:

1. **Geolocation Integration** - Tantangan muncul berdasarkan lokasi user
2. **Engaging UI/UX** - Saga map interaktif dengan parallax & sound effects
3. **Progressive Gameplay** - Sistem unlock level yang memotivasi eksplorasi
4. **Educational Content** - Trivia tentang heritage lokal
5. **Mobile-First Design** - Responsive dan touch-friendly

### Konsep Produksi

Dalam versi produksi:
- Tantangan dinamis berdasarkan koordinat GPS
- Database POI (Points of Interest) untuk setiap kota
- Multiplayer challenges & leaderboard
- AR features untuk enhanced experience
- Reward system & achievements

## 📝 License

MIT License - Lihat [LICENSE](LICENSE) untuk detail.

## 👥 Contributors

- **Developer**: [Your Name]
- **Concept**: City Tour Game Prototype

## 🐛 Known Issues

- Geolocation memerlukan HTTPS atau localhost
- Audio autoplay dibatasi oleh browser policy (memerlukan user interaction)
- Mock authentication untuk prototype (tidak production-ready)

## 📞 Contact

Untuk pertanyaan atau demo, hubungi:
- Email: [your-email@example.com]
- LinkedIn: [your-linkedin]

---

**Note**: Ini adalah prototype untuk demonstrasi konsep kepada investor. Tidak dimaksudkan untuk production deployment tanpa security enhancements.
