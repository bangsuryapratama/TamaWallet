# TamaWallet

> Aplikasi pengelolaan keuangan pribadi berbasis Progressive Web App (PWA) dengan prinsip *free-first*, *privacy-first*, *financial accuracy*, dan *no AI slop*.

Spesifikasi lengkap proyek didefinisikan dalam [PRD.md](./PRD.md).

---

## Modul 0 — Project Foundation (Status Selesai)

Fondasi arsitektur dasar telah disiapkan:
- **Next.js 14 App Router** dengan TypeScript *strict mode*.
- **Tailwind CSS & Design Tokens** (palet netral, aksen emerald, token semantik positif/negatif/peringatan, dan *tabular-nums* untuk angka keuangan).
- **App Shell Responsif**:
  - Desktop: Sidebar navigasi dengan indikator status dan brand TamaWallet.
  - Mobile: Bottom Navigation responsif 5-tab.
  - Routing 5 halaman utama: `/dashboard`, `/wallets`, `/transactions`, `/goals`, `/insights`.
  - Halaman `/login` terisolasi terpisah dari App Shell utama sesuai PRD Bagian 4.1.
- **Komponen UI Dasar**: `Button`, `Card`, `Badge`, `Input`, `PageHeader`, `EmptyState`, `LoadingState`, `ErrorState`.
- **Supabase Integration Setup**: Browser client & Server client helper yang siap menerima environment variables tanpa membocorkan kredensial atau menginjeksi mock data palsu ke produksi.
- **TypeScript Database Schema**: Definisi tipe data lengkap untuk `profiles`, `wallets`, `transactions`, `categories`, `goals`, `audit_logs`, dsb. sesuai PRD Bagian 8.

---

## Prasyarat Lingkungan

- **Node.js**: `v18.17+` atau `v20+` (diuji pada `v26.5.1`)
- **Package Manager**: `npm`

---

## Panduan Setup Lokal

### 1. Kloning & Instalasi Dependency

```bash
# Instalasi seluruh dependency
npm install
```

### 2. Konfigurasi Environment Variables

Salin file contoh konfigurasi:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi URL serta Kunci Anonim proyek Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> **Keamanan:** Jangan pernah menambahkan `SUPABASE_SERVICE_ROLE_KEY` ke variabel berawalan `NEXT_PUBLIC_` karena kunci tersebut memberikan bypass RLS penuh dan tidak boleh bocor ke client.

### 3. Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000). Rute utama otomatis mengarahkan ke `/dashboard`.

---

## Skrip NPM yang Tersedia

- `npm run dev` — Menjalankan development server lokal di port 3000.
- `npm run build` — Melakukan kompilasi produksi dan typecheck Next.js.
- `npm run start` — Menjalankan hasil build produksi lokal.
- `npm run lint` — Menjalankan pemeriksaan ESLint untuk aturan Next.js & TypeScript.
- `npm run typecheck` — Menjalankan TypeScript compiler check tanpa emit file (`tsc --noEmit`).

---

## Struktur Direktori

```text
├── src/
│   ├── app/
│   │   ├── (app)/                   # Rute dalam App Shell
│   │   │   ├── dashboard/page.tsx   # Dashboard ringkasan finansial
│   │   │   ├── wallets/page.tsx     # Multi-wallet & akun
│   │   │   ├── transactions/page.tsx# Transaksi & mutasi
│   │   │   ├── goals/page.tsx       # Goals & alokasi dana
│   │   │   ├── insights/page.tsx    # Analisis & insight deterministik
│   │   │   ├── layout.tsx           # Layout pembungkus App Shell
│   │   │   └── page.tsx             # Redirect ke /dashboard
│   │   ├── (auth)/                  # Rute autentikasi terpisah
│   │   │   └── login/page.tsx       # Halaman login terisolasi
│   │   ├── globals.css              # Design tokens & utilitas CSS
│   │   ├── layout.tsx               # Root Layout
│   │   └── not-found.tsx            # Halaman 404
│   ├── components/
│   │   ├── layout/                  # App Shell, Sidebar, TopBar, BottomNav
│   │   └── ui/                      # Button, Card, Badge, Input, State components
│   ├── lib/
│   │   ├── supabase/                # Client & Server Supabase helpers
│   │   ├── env.ts                   # Validasi Zod environment variables
│   │   └── utils.ts                 # cn() class merge & currency formatting
│   └── types/
│       └── database.ts              # Database types sesuai PRD Section 8
├── PRD.md                           # Product Requirements Document
├── tailwind.config.ts               # Konfigurasi Tailwind & design tokens
├── tsconfig.json                    # Konfigurasi TypeScript strict mode
└── package.json
```

---

## Roadmap Modul Selanjutnya

1. **Modul 1 — Authentication & Database**: Supabase Auth, login/logout, proteksi route middleware, skema SQL migration, dan RLS policies.
2. **Modul 2 — Wallet & Ledger**: CRUD multi-wallet, saldo awal, pencatatan transaksi, transfer deterministik, rekonsiliasi, audit trail.
3. **Modul 3 — Cashflow**: Agregasi arus kas, kategori transaksi, filter periode, chart cashflow, impor & ekspor CSV.
4. **Modul 4 — Goals**: CRUD goal finansial, alokasi saldo tanpa duplikasi aset, kalkulator proyeksi kontribusi.
5. **Modul 5 — Insight**: Analisis kategori, evaluasi rasio tabungan, tren kekayaan bersih tanpa halusinasi AI.
6. **Modul 6 — AI Copilot**: Parsing input transaksi natural language, konfirmasi eksplisit pengguna, fallback non-AI.
7. **Modul 7 — PWA & Reliability**: Offline fallback, service worker, audit keandalan, dan persiapan deployment.
