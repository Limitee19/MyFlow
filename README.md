# MyFlow - Manajer Kehidupan Pribadi

Aplikasi manajemen kehidupan pribadi terpadu yang menggabungkan pelacakan keuangan pribadi, catatan terstruktur pintar, dan target/pengingat dengan timeline aktivitas.

## 🚀 Fitur

### ✅ Sudah Diimplementasikan
- **Sistem Autentikasi**
  - Registrasi dan login pengguna
  - Manajemen sesi dengan NextAuth.js
  - Route yang dilindungi
  - Isolasi data per pengguna

- **Dasbor**
  - Ringkasan statistik keuangan
  - Tombol aksi cepat
  - Desain responsif

- **Pelacak Keuangan**
  - Form tambah transaksi
  - Daftar transaksi
  - Manajemen kategori
  - Pelacakan pemasukan/pengeluaran
  - Hapus transaksi

- **Catatan Pintar**
  - Sistem editor berbasis blok
  - Dukungan blok TEXT dan CHECKLIST
  - Manajemen tag
  - CRUD lengkap untuk catatan

- **Target & Tujuan**
  - Buat target tabungan atau batas pengeluaran
  - Pelacakan progress otomatis
  - Indikator status (AMAN/PERINGATAN/TERLAMPAUI)
  - Progress bar visual
  - Periode bulanan/tahunan

- **Pengingat**
  - Buat dan kelola pengingat
  - Prioritas (RENDAH/SEDANG/TINGGI)
  - Status (TERTUNDA/SELESAI/DIABAIKAN)
  - Deteksi keterlambatan otomatis
  - Filter berdasarkan status

## 🛠️ Stack Teknologi

- **Frontend & Backend**: Next.js 14 (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Autentikasi**: NextAuth.js (Credentials)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Instalasi

### Prasyarat
- Node.js 18+ terinstal
- Database PostgreSQL (lokal atau cloud)

### Langkah Setup

1. **Clone atau navigasi ke proyek**
   ```bash
   cd "d:/DATA FAFA/PROJECT PKL/MyFlow"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variables**
   
   Salin `.env.example` ke `.env` dan perbarui nilainya:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/myflow?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

   Untuk generate `NEXTAUTH_SECRET` yang aman:
   ```bash
   openssl rand -base64 32
   ```

4. **Setup database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Jalankan development server**
   ```bash
   npm run dev
   ```

7. **Buka browser Anda**
   
   Navigasi ke [http://localhost:3000](http://localhost:3000)

## 🗄️ Skema Database

Aplikasi menggunakan model utama berikut:

- **User**: Autentikasi dan profil
- **Transaction**: Catatan pemasukan dan pengeluaran
- **Category**: Kategori transaksi
- **Note**: Container catatan pintar
- **NoteBlock**: Blok individual dalam catatan
- **Goal**: Target keuangan dan tujuan
- **Reminder**: Pengingat berbasis tanggal
- **Activity**: Timeline aktivitas terpadu

## 📱 Penggunaan

1. **Daftar** akun baru di `/register`
2. **Masuk** dengan kredensial Anda
3. **Dasbor** - Lihat ringkasan Anda
4. **Keuangan** - Tambah transaksi pemasukan/pengeluaran
5. **Catatan** - Buat catatan terstruktur dengan blok
6. **Target** - Tetapkan target keuangan
7. **Pengingat** - Kelola pengingat Anda

## 🚀 Deployment

### Deployment Vercel

1. **Setup database produksi** (Neon, Supabase, atau PlanetScale)

2. **Push kode Anda ke GitHub**

3. **Import ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Import repository Anda
   - Tambahkan environment variables:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (URL produksi Anda)
     - `NEXTAUTH_SECRET`

4. **Jalankan migrations**
   ```bash
   npx prisma migrate deploy
   ```

## 📝 Roadmap Pengembangan

- [x] Setup proyek
- [x] Sistem autentikasi
- [x] Dasbor dasar
- [x] Skema database
- [x] API transaksi
- [x] Form transaksi dan fitur hapus
- [x] Catatan pintar dengan blok
- [x] Pelacakan target
- [x] Sistem pengingat
- [ ] Timeline aktivitas
- [ ] Pencarian dan filter
- [ ] Responsivitas mobile
- [ ] Toggle dark mode
- [ ] Fitur ekspor data

## 🤝 Kontribusi

Ini adalah proyek portfolio/pembelajaran. Silakan fork dan sesuaikan untuk penggunaan Anda sendiri!

## 📄 Lisensi

MIT License - silakan gunakan proyek ini untuk tujuan pembelajaran dan portfolio.

## 👤 Penulis

Dibuat sebagai proyek portfolio full-stack yang mendemonstrasikan:
- Next.js 14 App Router
- TypeScript
- Prisma ORM
- NextAuth.js
- UI/UX modern dengan Tailwind CSS
- Desain RESTful API
- Desain database dan relasi

---

**Catatan**: Semua fitur utama telah diimplementasikan dan diterjemahkan ke bahasa Indonesia.
