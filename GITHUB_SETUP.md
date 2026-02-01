# 🐙 GitHub Setup Guide

Panduan langkah demi langkah untuk push project ke GitHub dan deploy.

## 📝 Step 1: Persiapan Repository Lokal

Git repository sudah di-initialize. Sekarang tambahkan semua file:

```bash
cd /Volumes/Local\ Storage/KDI/app/huntjid/city-tour-game

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit: City Tour Game prototype

Features:
- Authentication mockup dengan NextAuth pattern
- Saga Map dengan parallax scroll & sound effects
- Geolocation-based challenges
- Location verification (500m radius)
- Trivia mini game
- Responsive design dengan Tailwind CSS
- Framer Motion animations"
```

## 🌐 Step 2: Buat Repository di GitHub

### Via GitHub Website

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **"+"** → **"New repository"**
3. Isi form:
   - **Repository name**: `city-tour-game`
   - **Description**: `🗺️ Prototype Web-Based City Tour Game dengan geolocation & interactive challenges`
   - **Visibility**: Public atau Private (pilih sesuai kebutuhan)
   - **JANGAN** centang "Initialize with README" (kita sudah punya)
4. Klik **"Create repository"**

### Via GitHub CLI (Alternative)

```bash
# Install GitHub CLI jika belum
brew install gh

# Login
gh auth login

# Create repository
gh repo create city-tour-game --public --source=. --remote=origin

# Atau private
gh repo create city-tour-game --private --source=. --remote=origin
```

## 🔗 Step 3: Connect & Push ke GitHub

Setelah repository dibuat, GitHub akan menampilkan commands. Gunakan yang ini:

```bash
# Add remote
git remote add origin https://github.com/[USERNAME]/city-tour-game.git

# Atau dengan SSH (recommended)
git remote add origin git@github.com:[USERNAME]/city-tour-game.git

# Verify remote
git remote -v

# Push ke GitHub
git branch -M main
git push -u origin main
```

**Replace `[USERNAME]`** dengan username GitHub Anda.

## ✅ Step 4: Verify Upload

1. Refresh halaman repository di GitHub
2. Pastikan semua file sudah ter-upload
3. Check README.md tampil dengan baik

## 🚀 Step 5: Deploy ke Vercel (Recommended)

### Option A: Via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub account
3. Klik **"Add New Project"**
4. **Import** repository `city-tour-game`
5. Vercel auto-detect Next.js settings:
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
6. Klik **"Deploy"**
7. Tunggu ~2-3 menit
8. ✅ Done! Dapatkan URL: `https://city-tour-game.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

## 🔒 Step 6: Environment Variables (Optional)

Jika ada environment variables:

### Via Vercel Dashboard
1. Project Settings → Environment Variables
2. Add variables dari `.env.example`
3. Redeploy

### Via Vercel CLI
```bash
vercel env add NEXT_PUBLIC_TARGET_LAT
# Enter value: -6.1754

vercel env add NEXT_PUBLIC_TARGET_LNG
# Enter value: 106.8272
```

## 📱 Step 7: Test Deployment

1. Buka URL deployment (e.g., `https://city-tour-game.vercel.app`)
2. Test checklist:
   - [ ] Login page loads
   - [ ] Login button works
   - [ ] Map displays dengan parallax
   - [ ] Audio klik works (perlu user interaction)
   - [ ] Geolocation modal muncul
   - [ ] Challenges accessible
   - [ ] Responsive di mobile

## 🔄 Step 8: Continuous Deployment

Setiap push ke `main` branch akan auto-deploy:

```bash
# Make changes
git add .
git commit -m "Update: [description]"
git push origin main

# Vercel automatically deploys
```

## 🌿 Step 9: Branching Strategy (Optional)

Untuk development yang lebih terstruktur:

```bash
# Create development branch
git checkout -b development

# Make changes
git add .
git commit -m "Feature: [description]"
git push origin development

# Create Pull Request di GitHub
# Merge ke main setelah review
```

Vercel akan create preview deployment untuk setiap branch/PR.

## 📊 Step 10: Add Badges ke README

Update README.md dengan badges:

```markdown
![Deployment](https://img.shields.io/github/deployments/[USERNAME]/city-tour-game/production?label=vercel&logo=vercel)
![Last Commit](https://img.shields.io/github/last-commit/[USERNAME]/city-tour-game)
![License](https://img.shields.io/github/license/[USERNAME]/city-tour-game)
```

## 🎯 Quick Commands Reference

```bash
# Clone repository (untuk collaborators)
git clone https://github.com/[USERNAME]/city-tour-game.git

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/new-feature

# Push branch
git push origin feature/new-feature

# Delete branch (after merge)
git branch -d feature/new-feature
git push origin --delete feature/new-feature

# View deployment logs
vercel logs [deployment-url]

# Rollback deployment
vercel rollback [deployment-url]
```

## 🐛 Troubleshooting

### Push Rejected

```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Large Files Error

```bash
# Check file sizes
git ls-files -z | xargs -0 du -h | sort -h -r | head -20

# Remove large files
git rm --cached [large-file]
echo "[large-file]" >> .gitignore
git commit -m "Remove large file"
```

### Vercel Build Failed

1. Check build logs di Vercel dashboard
2. Test build locally: `npm run build`
3. Check Node.js version compatibility
4. Verify all dependencies installed

## 📞 Support

- **GitHub Issues**: `https://github.com/[USERNAME]/city-tour-game/issues`
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Selamat! Project sudah siap di GitHub dan deployed! 🎉**
