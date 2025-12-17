# ⚡ MyFlow - Quick Start Guide

## 🎯 Yang Harus Dilakukan (Urutan Penting!)

### 1️⃣ Generate Secret Key
```powershell
node scripts/generate-secret.js
```
Copy hasilnya untuk dipakai di step 3.

### 2️⃣ Setup Database
Pilih salah satu:
- **Neon** (Recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Local PostgreSQL**: Install di komputer

Copy **connection string** dari database yang dipilih.

### 3️⃣ Edit File .env
```powershell
copy .env.example .env
notepad .env
```

Isi dengan:
```env
DATABASE_URL="connection-string-dari-step-2"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="secret-dari-step-1"
```

### 4️⃣ Jalankan Setup (Otomatis)
```powershell
setup.bat
```

**ATAU Manual:**
```powershell
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 5️⃣ Jalankan Server
```powershell
npm run dev
```

Buka: http://localhost:3000

---

## 📝 Checklist Setup

- [ ] Secret key sudah di-generate
- [ ] Database sudah dibuat (Neon/Supabase/Local)
- [ ] File `.env` sudah diisi dengan benar
- [ ] Dependencies sudah terinstall
- [ ] Prisma client sudah di-generate
- [ ] Migration sudah dijalankan
- [ ] Server berjalan di http://localhost:3000
- [ ] Bisa register & login

---

## 🚨 Error Umum & Solusi

| Error | Solusi |
|-------|--------|
| "Invalid DATABASE_URL" | Cek format connection string di `.env` |
| "NEXTAUTH_SECRET is not set" | Generate secret dan isi di `.env` |
| "Cannot find module @prisma/client" | Jalankan `npx prisma generate` |
| "Table doesn't exist" | Jalankan `npx prisma migrate dev` |
| Port 3000 sudah dipakai | Gunakan `npm run dev -- -p 3001` |

---

## 🛠️ Command Berguna

```powershell
# Generate secret key
node scripts/generate-secret.js

# Lihat database di browser
npx prisma studio

# Reset database (HATI-HATI!)
npx prisma migrate reset

# Cek status migration
npx prisma migrate status

# Build untuk production
npm run build

# Jalankan production build
npm start
```

---

## 📚 File Penting

- `SETUP_GUIDE.md` - Panduan lengkap step-by-step
- `README.md` - Dokumentasi project
- `.env` - Environment variables (JANGAN di-commit!)
- `.env.example` - Template environment variables
- `prisma/schema.prisma` - Database schema

---

## 🎉 Setelah Setup Berhasil

1. Register user baru di `/register`
2. Login di `/login`
3. Explore dashboard
4. Coba tambah transaction di Finance
5. Lanjut development! 🚀

---

## 💡 Tips

- Gunakan `npx prisma studio` untuk melihat data di database
- Jangan commit file `.env` ke Git
- Backup database sebelum `migrate reset`
- Gunakan Neon untuk deployment (gratis & mudah)

---

**Butuh bantuan?** Baca `SETUP_GUIDE.md` untuk panduan detail!
