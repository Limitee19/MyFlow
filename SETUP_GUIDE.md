# 🚀 PANDUAN SETUP MYFLOW - LANGKAH DEMI LANGKAH

## ⚠️ PENTING: Ikuti urutan ini dengan teliti!

---

## STEP 1: Generate NEXTAUTH_SECRET

Anda perlu membuat secret key yang aman. Pilih SALAH SATU cara:

### Cara 1: Menggunakan PowerShell (Recommended)
Buka PowerShell dan jalankan:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya, contoh output:
```
xK9mP2nQ5rS8tU1vW3xY6zA0bC4dE7fH9iJ2kL5mN8oP1qR4sT7uV0wX3yZ6
```

### Cara 2: Online Generator
1. Buka browser
2. Kunjungi: https://generate-secret.vercel.app/32
3. Copy secret yang muncul

### Cara 3: Menggunakan OpenSSL (jika terinstall)
```bash
openssl rand -base64 32
```

**SIMPAN SECRET INI!** Anda akan memasukkannya ke file `.env` nanti.

---

## STEP 2: Setup Database PostgreSQL

Anda HARUS punya database PostgreSQL. Pilih salah satu:

### 🌟 OPTION A: Neon (RECOMMENDED - Gratis & Mudah)

1. **Buka browser** → https://neon.tech
2. **Sign up** dengan GitHub atau Google
3. **Klik "Create Project"**
4. **Isi form:**
   - Project name: `myflow`
   - Region: **Singapore** (paling dekat dengan Indonesia)
   - Postgres version: biarkan default
5. **Klik "Create Project"**
6. **Tunggu ~30 detik** sampai project selesai dibuat
7. **PENTING:** Akan muncul **Connection String**, contoh:
   ```
   postgresql://myflow_owner:npg_xxx@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/myflow?sslmode=require
   ```
8. **COPY seluruh connection string ini!**

### OPTION B: Supabase (Gratis)

1. **Buka browser** → https://supabase.com
2. **Sign up** dan login
3. **Klik "New Project"**
4. **Isi form:**
   - Name: `myflow`
   - Database Password: **Buat password kuat** (contoh: `MyFlow2024!Secure`)
   - Region: **Southeast Asia (Singapore)**
5. **Klik "Create new project"**
6. **Tunggu ~2 menit** sampai selesai
7. **Ke menu Settings** (kiri bawah) → **Database**
8. **Scroll ke "Connection string"**
9. **Pilih tab "URI"**
10. **Copy connection string**, contoh:
    ```
    postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
    ```
11. **REPLACE `[YOUR-PASSWORD]`** dengan password yang tadi Anda buat

### OPTION C: Local PostgreSQL (Jika sudah terinstall)

Jika Anda sudah install PostgreSQL di komputer:

1. **Buka pgAdmin** atau terminal
2. **Buat database baru** bernama `myflow`
3. **Connection string:**
   ```
   postgresql://postgres:PASSWORD_ANDA@localhost:5432/myflow
   ```
   Ganti `PASSWORD_ANDA` dengan password PostgreSQL Anda

---

## STEP 3: Update File .env

Sekarang edit file `.env` di root project:

1. **Buka file:** `d:/DATA FAFA/PROJECT PKL/MyFlow/.env`
2. **Ganti isinya** dengan format ini:

```env
# Database - GANTI dengan connection string dari Neon/Supabase
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth - GANTI dengan secret yang sudah di-generate
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="SECRET_YANG_SUDAH_DIGENERATE_TADI"
```

**CONTOH LENGKAP (Neon):**
```env
DATABASE_URL="postgresql://myflow_owner:npg_AbCdEf123@ep-cool-name.ap-southeast-1.aws.neon.tech/myflow?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="xK9mP2nQ5rS8tU1vW3xY6zA0bC4dE7fH9iJ2kL5mN8oP1qR4sT7uV0wX3yZ6"
```

**CONTOH LENGKAP (Supabase):**
```env
DATABASE_URL="postgresql://postgres.xxx:MyFlow2024!Secure@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="xK9mP2nQ5rS8tU1vW3xY6zA0bC4dE7fH9iJ2kL5mN8oP1qR4sT7uV0wX3yZ6"
```

**⚠️ PENTING:** 
- Jangan ada spasi di sekitar `=`
- Gunakan tanda kutip `"` untuk value
- Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)

---

## STEP 4: Install Dependencies (Jika Belum)

Buka PowerShell di folder project, jalankan:

```powershell
cd "d:\DATA FAFA\PROJECT PKL\MyFlow"
npm install
```

Tunggu sampai selesai (~2-3 menit).

---

## STEP 5: Generate Prisma Client

Jalankan command ini:

```powershell
npx prisma generate
```

Output yang benar:
```
✔ Generated Prisma Client
```

---

## STEP 6: Buat Database Tables (Migration)

Ini akan membuat semua tabel di database:

```powershell
npx prisma migrate dev --name init
```

**Anda akan ditanya:**
```
? Enter a name for the new migration: › 
```
Ketik: `init` lalu Enter

**Output yang benar:**
```
✔ Generated Prisma Client
✔ Applied migration: init
```

**Jika ada error "database doesn't exist":**
- Pastikan DATABASE_URL sudah benar
- Pastikan database sudah dibuat di Neon/Supabase

---

## STEP 7: Jalankan Development Server

```powershell
npm run dev
```

**Output yang benar:**
```
▲ Next.js 14.2.21
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

---

## STEP 8: Test Aplikasi

1. **Buka browser** → http://localhost:3000
2. **Akan redirect ke** → http://localhost:3000/login
3. **Klik "Sign up"** untuk register
4. **Isi form:**
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. **Klik "Sign up"**
6. **Akan redirect ke login page**
7. **Login** dengan email dan password tadi
8. **Seharusnya masuk ke Dashboard** ✅

---

## ✅ CHECKLIST - Pastikan Semua Sudah Dilakukan

- [ ] NEXTAUTH_SECRET sudah di-generate
- [ ] Database PostgreSQL sudah dibuat (Neon/Supabase/Local)
- [ ] File `.env` sudah diupdate dengan benar
- [ ] `npm install` sudah dijalankan
- [ ] `npx prisma generate` sudah dijalankan
- [ ] `npx prisma migrate dev` sudah dijalankan
- [ ] `npm run dev` berjalan tanpa error
- [ ] Bisa buka http://localhost:3000
- [ ] Bisa register user baru
- [ ] Bisa login
- [ ] Dashboard muncul dengan benar

---

## 🐛 TROUBLESHOOTING

### Error: "Invalid DATABASE_URL"
**Solusi:**
- Pastikan tidak ada spasi di connection string
- Pastikan format benar: `postgresql://user:pass@host:port/db`
- Cek apakah database sudah dibuat di Neon/Supabase

### Error: "NEXTAUTH_SECRET is not set"
**Solusi:**
- Pastikan file `.env` ada di root folder
- Pastikan NEXTAUTH_SECRET sudah diisi
- Restart server (`Ctrl+C` lalu `npm run dev` lagi)

### Error: "Cannot find module '@prisma/client'"
**Solusi:**
```powershell
npx prisma generate
```

### Error: "Table 'users' doesn't exist"
**Solusi:**
```powershell
npx prisma migrate dev --name init
```

### Port 3000 sudah dipakai
**Solusi:**
```powershell
npm run dev -- -p 3001
```
Lalu buka http://localhost:3001

---

## 📞 BANTUAN LEBIH LANJUT

Jika masih ada error, screenshot error message dan tanyakan!

**File penting untuk dicek:**
- `.env` - Environment variables
- `prisma/schema.prisma` - Database schema
- `package.json` - Dependencies

**Command berguna:**
```powershell
# Lihat database di browser
npx prisma studio

# Reset database (hati-hati, data hilang!)
npx prisma migrate reset

# Cek status migration
npx prisma migrate status
```

---

## 🎉 SELESAI!

Jika semua checklist sudah ✅, aplikasi Anda siap digunakan!

**Next steps:**
- Coba tambah transaction di Finance page
- Explore fitur-fitur yang sudah ada
- Lanjut development fitur berikutnya
