# 🚀 Deployment Guide - City Tour Game

Panduan lengkap untuk deploy City Tour Game ke berbagai platform.

## 📋 Pre-Deployment Checklist

- [ ] Test build locally: `npm run build`
- [ ] Verify semua environment variables
- [ ] Test di berbagai browser (Chrome, Safari, Firefox)
- [ ] Test geolocation di HTTPS
- [ ] Verify audio playback
- [ ] Check responsive design (mobile, tablet, desktop)

## 🌐 Option 1: Vercel (Recommended)

### Mengapa Vercel?
- ✅ Optimized untuk Next.js
- ✅ Automatic deployments dari Git
- ✅ Free SSL certificate
- ✅ Edge network untuk performance
- ✅ Preview deployments untuk setiap PR

### Deploy via Vercel Dashboard

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: City Tour Game prototype"
   git branch -M main
   git remote add origin https://github.com/[username]/city-tour-game.git
   git push -u origin main
   ```

2. **Import ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import repository dari GitHub
   - Vercel akan auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Domain (Optional)**
   - Settings → Domains
   - Add custom domain atau gunakan `*.vercel.app`

### Deploy via Vercel CLI

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

### Environment Variables (Vercel)

Jika ada environment variables:
```bash
# Via CLI
vercel env add NEXT_PUBLIC_API_URL

# Via Dashboard
Settings → Environment Variables
```

## 🔷 Option 2: Netlify

### Deploy via Netlify Dashboard

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Deploy**
   - Drag & drop folder `.next` ke Netlify
   - Atau connect ke GitHub repository

### Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## 🐙 Option 3: GitHub Pages

**Note**: GitHub Pages tidak support server-side rendering. Gunakan static export.

### Setup Static Export

1. **Update `next.config.mjs`**
   ```js
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```

2. **Build & Deploy**
   ```bash
   npm run build
   
   # Deploy ke gh-pages branch
   npx gh-pages -d out
   ```

3. **GitHub Settings**
   - Repository → Settings → Pages
   - Source: Deploy from branch `gh-pages`

## 🐳 Option 4: Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Commands

```bash
# Build
docker build -t city-tour-game .

# Run
docker run -p 3000:3000 city-tour-game

# Docker Compose
docker-compose up
```

## ☁️ Option 5: Cloud Platforms

### AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Google Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/[PROJECT-ID]/city-tour-game

# Deploy
gcloud run deploy city-tour-game \
  --image gcr.io/[PROJECT-ID]/city-tour-game \
  --platform managed \
  --region asia-southeast1
```

## 🔒 Security Considerations

### Before Production

1. **Environment Variables**
   - Jangan commit `.env` files
   - Gunakan platform secrets management
   - Prefix dengan `NEXT_PUBLIC_` untuk client-side vars

2. **Authentication**
   - Replace mock auth dengan real authentication
   - Implement proper session management
   - Add CSRF protection

3. **API Security**
   - Add rate limiting
   - Implement proper CORS
   - Validate all inputs

4. **HTTPS**
   - Enforce HTTPS untuk geolocation
   - Set secure cookies
   - Add security headers

## 📊 Monitoring & Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```jsx
// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

```jsx
// app/layout.js
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

## 🔧 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Geolocation Issues

- Pastikan deploy di HTTPS
- Check browser permissions
- Test dengan mock location

### Audio Not Playing

- Audio memerlukan user interaction
- Check browser autoplay policy
- Verify Web Audio API support

## 📱 Post-Deployment Testing

```bash
# Test checklist
- [ ] Login flow works
- [ ] Map loads dan scrollable
- [ ] Geolocation verification works
- [ ] Audio effects play on click
- [ ] Trivia questions display correctly
- [ ] Level completion saves to localStorage
- [ ] Responsive di mobile devices
- [ ] Performance (Lighthouse score > 90)
```

## 🎯 Performance Optimization

### Image Optimization

```jsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  alt="City Tour"
  priority
/>
```

### Code Splitting

```jsx
// Dynamic imports untuk components besar
import dynamic from 'next/dynamic';

const LocationBasedChallenge = dynamic(
  () => import('@/components/LocationBasedChallenge'),
  { loading: () => <p>Loading...</p> }
);
```

## 📞 Support

Jika ada masalah deployment:
1. Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
2. Check platform-specific documentation
3. Review build logs untuk error messages

---

**Happy Deploying! 🚀**
