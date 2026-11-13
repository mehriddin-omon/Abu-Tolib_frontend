# Abu Tolib — frontend (web)

Milliy sertifikat (matematika) diagnostika platformasining veb-ilovasi.
Backend: [Abu_Tolib-backend](https://github.com/mehriddin-omon/Abu_Tolib-backend).

**Texnologiyalar:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · TanStack Query · KaTeX

## Lokal ishga tushirish

Avval backend'ni ishga tushiring (`http://localhost:4000`), keyin:

```bash
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

`/api/v1/*` so'rovlari lokal ravishda backend'ga yo'naltiriladi (`next.config.ts`),
production'da esa buni Caddy qiladi — brauzer uchun API va sayt bitta domenda.

`NEXT_PUBLIC_DEV_LOGIN=true` bo'lsa, kirish sahifasida botsiz «Talaba / Admin» tugmalari chiqadi
(backend'da ham `AUTH_DEV_LOGIN=true` kerak).

## Tuzilma

```
src/
├─ middleware.ts            # token muddati tugasa refresh; /kirish va /admin yo'naltirishlari
├─ app/
│  ├─ page.tsx              # bosh sahifa (ochiq)
│  ├─ kirish/               # Telegram orqali kirish
│  ├─ (talaba)/             # bosh, darslar (+ dars sahifasi), diagnostika, yozma
│  └─ admin/                # panel, o'quvchilar, yozma
│     ├─ kontent/           # bo'limlar daraxti, [code] — konspekt tahriri (jonli ko'rinish)
│     ├─ savollar/          # savollar banki, savol formasi, CSV import
│     └─ testlar/           # testlar ro'yxati, [id] — savollarni yig'ish va tartiblash
├─ components/
│  ├─ ui/                   # shadcn komponentlari
│  ├─ app/                  # AppShell (sidebar), Brand, PageHeader
│  └─ math/math-md.tsx      # Markdown + KaTeX (konspekt, savol, variant)
└─ lib/
   ├─ api.ts                # brauzer: fetch + avtomatik refresh
   ├─ server-api.ts         # server komponentlar: cookie'larni backend'ga uzatadi
   └─ types.ts              # backend bilan umumiy turlar
```

## Buyruqlar

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Ishlab chiqish |
| `npm run build` / `npm start` | Production build va standalone server |
| `npm run lint` / `npm run typecheck` | Kod sifati |

Deploy: `main` ga push → GitHub Actions image yig'adi (`ghcr.io/mehriddin-omon/abu-tolib-web`)
va Droplet'da yangilaydi. Batafsil — backend repozitoriyasidagi `deploy/README.md`.
