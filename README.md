MyFlow – Manajer Kehidupan Pribadi

MyFlow adalah aplikasi manajemen kehidupan pribadi terpadu yang dirancang untuk membantu pengguna mengelola aspek penting kehidupan sehari-hari dalam satu platform, mulai dari keuangan pribadi, catatan terstruktur, hingga target dan pengingat, yang semuanya terintegrasi dalam satu sistem.

Aplikasi ini berfokus pada isolasi data per pengguna, pengalaman penggunaan yang intuitif, serta visualisasi progres yang jelas untuk membantu pengguna membuat keputusan yang lebih baik.

🚀 Fitur Utama
🔐 Sistem Autentikasi

Registrasi dan login pengguna

Manajemen sesi menggunakan NextAuth.js

Route yang dilindungi

Isolasi data antar pengguna

📊 Dasbor

Ringkasan statistik keuangan

Akses cepat ke fitur utama

Desain responsif untuk berbagai ukuran layar

💰 Pelacak Keuangan

Pencatatan pemasukan dan pengeluaran

Manajemen kategori transaksi

Daftar transaksi terstruktur

Penghapusan transaksi

Ringkasan kondisi keuangan pengguna

📝 Catatan Pintar

Editor catatan berbasis blok

Dukungan blok TEXT dan CHECKLIST

Manajemen tag

Operasi CRUD penuh untuk catatan

Cocok untuk journaling, to-do list, dan pencatatan ide

🎯 Target & Tujuan

Pembuatan target tabungan atau batas pengeluaran

Pelacakan progres otomatis berdasarkan transaksi

Indikator status:

AMAN

PERINGATAN

TERLAMPAUI

Progress bar visual

Dukungan periode bulanan dan tahunan

⏰ Pengingat

Pembuatan dan pengelolaan pengingat

Prioritas pengingat (RENDAH / SEDANG / TINGGI)

Status pengingat (TERTUNDA / SELESAI / DIABAIKAN)

Deteksi keterlambatan otomatis

Filter berdasarkan status pengingat

🛠️ Teknologi yang Digunakan

Framework: Next.js 14 (App Router)

Bahasa: TypeScript

Styling: Tailwind CSS

Autentikasi: NextAuth.js (Credentials)

Database: PostgreSQL

ORM: Prisma

Visualisasi Data: Recharts

Icons: Lucide React

🗄️ Arsitektur Data

MyFlow menggunakan struktur database relasional dengan model utama:

User – data pengguna dan autentikasi

Transaction – pemasukan dan pengeluaran

Category – kategori transaksi

Note – catatan utama

NoteBlock – blok konten catatan

Goal – target dan tujuan keuangan

Reminder – pengingat berbasis waktu
