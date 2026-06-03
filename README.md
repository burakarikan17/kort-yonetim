# Kort Rezervasyon Paneli

Tek bir tenis kortu için özel kullanım amaçlı rezervasyon yönetim sistemi. Müşteri girişi yoktur; panel sadece kort sahibi/admin tarafından kullanılır.

## Teknoloji

- Next.js 15 App Router
- TypeScript strict mode
- TailwindCSS
- Supabase Database + Supabase Auth
- Cloudflare Workers/Pages uyumlu OpenNext build
- Domain: `kort.burakarikan.online`

## Özellikler

- Email + şifre ile tek admin girişi
- Giriş yapılmadan sayfalara erişim engeli
- Dashboard: bugünün rezervasyonları, yaklaşan rezervasyonlar, aylık gelir özeti
- Günlük ve haftalık takvim görünümü
- Saatlik bloklarda yeşil boş, kırmızı dolu gösterimi
- Rezervasyon ekleme, düzenleme, tarih/saat değiştirme ve silme
- Aynı saat aralığına ikinci rezervasyon engeli
- İsme veya telefon numarasına göre arama
- Günlük, haftalık, aylık finans özeti
- Mobil uyumlu koyu admin paneli

## Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` değerleri:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ADMIN_EMAIL=admin@example.com
```

`ADMIN_EMAIL`, giriş yapmasına izin verilen tek admin email adresidir.

## Supabase

1. Supabase projesi oluşturun.
2. `supabase/migrations/001_initial_schema.sql` dosyasını Supabase SQL Editor veya Supabase CLI ile çalıştırın.
3. Authentication bölümünden admin kullanıcısını email + şifre ile oluşturun.
4. Admin email adresini `.env.local` içindeki `ADMIN_EMAIL` ile aynı yapın.

Migration şu tabloları oluşturur:

- `reservations`
- `settings`

Ayrıca veritabanı seviyesinde saat çakışmasını engelleyen trigger ve authenticated kullanıcılar için RLS policy ekler.

## Lokal Çalıştırma

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

Cloudflare runtime benzeri lokal geliştirme gerektiğinde:

```bash
CF_DEV=1 npm run dev
```

## Kontroller

```bash
npm run typecheck
npm run build
```

## Cloudflare Deploy

Cloudflare için önerilen Next.js 15 yolu OpenNext Cloudflare adapter kullanmaktır.

```bash
npm run preview
```

Deploy:

```bash
npm run deploy
```

Cloudflare ortam değişkenlerine şunları ekleyin:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_EMAIL`

Custom domain olarak `kort.burakarikan.online` bağlanmalıdır.
