# 🚀 Kenapa Push ke GitHub Tidak Langsung Muncul di Vercel?

**Push ke GitHub ≠ Deploy.** Vercel perlu **dihubungkan** ke repository GitHub Anda sekali. Setelah itu, setiap push ke branch yang terhubung akan otomatis deploy.

---

## ✅ Langkah: Hubungkan Repo ke Vercel

### 1. Buka Vercel
- Pergi ke **[vercel.com](https://vercel.com)** dan **login** (atau daftar).
- Gunakan **"Continue with GitHub"** agar repo GitHub bisa dipilih.

### 2. Import Project dari GitHub
- Klik **"Add New..."** → **"Project"**.
- Di daftar repo, cari **`city-tour-game`** (atau nama repo yang Anda push).
- Klik **"Import"** di samping repo tersebut.

### 3. Atur Root Directory (PENTING jika repo = folder `huntjid`)
Jika di GitHub **root repo Anda adalah folder `huntjid`** dan project Next.js ada di dalam **`city-tour-game`**:

- Di halaman "Configure Project", cari **"Root Directory"**.
- Klik **"Edit"**.
- Isi: **`city-tour-game`**.
- Klik **"Continue"**.

Jika repo Anda **langsung isinya isi folder `city-tour-game`** (tidak ada folder induk), **biarkan Root Directory kosong**.

### 4. Build Settings (biasanya sudah benar)
- **Framework Preset:** Next.js (auto-detect).
- **Build Command:** `npm run build` atau kosongkan (pakai default).
- **Output Directory:** kosongkan (default Next.js).
- **Install Command:** `npm install` atau kosongkan.

### 5. Deploy
- Klik **"Deploy"**.
- Tunggu 1–3 menit.
- Setelah selesai, Anda dapat **URL** seperti:  
  `https://city-tour-game-xxx.vercel.app`

---

## 🔄 Setelah Dihubungkan

- Setiap **push ke branch** yang terhubung (misalnya `main`) akan **auto-deploy**.
- Deploy baru akan muncul di **Dashboard Vercel** → pilih project → tab **"Deployments"**.

---

## ❓ Cek Jika Masih Tidak Muncul

### A. Repo tidak ada di daftar Vercel
- **Vercel** → **Add New** → **Project**.
- Pastikan **GitHub** sudah **Connected** (Settings → Git Integrations).
- Jika repo **private**, pastikan Vercel punya akses ke org/akun yang benar.

### B. Repo ada tapi build gagal
- Buka project di Vercel → **Deployments** → klik deployment yang gagal.
- Baca **Build Logs** (error merah).
- Jika error "No such file or directory" atau tidak ketemu `package.json`, kemungkinan **Root Directory** salah → set ke **`city-tour-game`**.

### C. Repo struktur
- **Opsi 1:** Repo = `huntjid` (ada folder `city-tour-game` di dalam).  
  → Di Vercel: **Root Directory** = **`city-tour-game`**.
- **Opsi 2:** Repo = isi langsung dari `city-tour-game` (tidak ada folder induk).  
  → **Root Directory** dikosongkan.

### D. Deploy dari CLI (alternatif)
Di laptop, dari **folder project** (yang ada `package.json`):

```bash
cd /Volumes/Local\ Storage/KDI/app/huntjid/city-tour-game
npx vercel
```

Ikuti prompt (login jika perlu, link ke repo jika ditanya). Setelah itu deploy juga bisa otomatis dari GitHub.

---

## 📌 Ringkasan

| Yang Anda kira | Kenyataan |
|----------------|----------|
| Push ke GitHub = langsung muncul di Vercel | Harus **import project** sekali di Vercel dan connect ke repo GitHub |
| Cukup push saja | Setelah connect, **push = auto deploy** |

**Langkah penting:** **Add New Project** → pilih repo **city-tour-game** (atau repo Anda) → jika repo berisi folder `city-tour-game`, set **Root Directory** = **`city-tour-game`** → **Deploy**.
