# TamaWallet — Product Requirements Document

**Versi:** 1.0.0
**Status:** MVP Development
**Platform:** Progressive Web App (PWA)
**Prinsip utama:** Free-first, privacy-first, financial accuracy, no AI slop.

---

## 1. Visi Produk

TamaWallet adalah aplikasi pengelolaan keuangan pribadi yang membantu pengguna memahami posisi keuangan secara menyeluruh, mengelola arus kas, memantau aset dan kewajiban, mencapai tujuan finansial, serta memperoleh insight yang relevan melalui AI.

TamaWallet bukan sekadar expense tracker. Produk ini harus menjadi satu sumber informasi keuangan pribadi yang transparan, fleksibel, dan dapat dipercaya.

### Tujuan utama

Pengguna harus dapat menjawab lima pertanyaan:

1. Berapa total uang dan aset yang saya miliki?
2. Ke mana uang saya pergi dan dari mana uang saya berasal?
3. Berapa uang yang benar-benar tersedia untuk digunakan?
4. Apakah kondisi keuangan saya sehat berdasarkan data aktual?
5. Apa langkah realistis berikutnya untuk mencapai tujuan finansial saya?

### Prinsip produk

- Gratis untuk penggunaan inti tanpa langganan wajib.
- Perhitungan keuangan dilakukan secara deterministik, bukan diserahkan kepada AI.
- Semua angka penting harus dapat ditelusuri sumbernya.
- AI membantu pengguna, bukan mengarang data atau mengambil kendali.
- UI harus sederhana, matang, responsif, dan nyaman digunakan setiap hari.
- Tidak ada fitur yang hanya menjadi pajangan.

---

## 2. Target Pengguna

Pengguna utama adalah individu yang ingin mengelola seluruh keuangan pribadi dari satu tempat.

Karakteristik kebutuhan:

- Memiliki beberapa rekening bank, e-wallet, uang tunai, dan investasi.
- Memiliki pemasukan rutin dan tidak rutin.
- Membutuhkan budgeting, dana darurat, serta tujuan keuangan.
- Ingin memahami pola konsumsi dan perkembangan kekayaan bersih.
- Ingin mencatat transaksi dengan cepat melalui form atau percakapan.
- Mengutamakan privasi dan tidak ingin membayar banyak layanan berlangganan.

MVP awal digunakan oleh satu pemilik akun. Arsitektur tetap harus aman jika nantinya digunakan oleh beberapa pengguna.

---

## 3. Batasan MVP

### Fitur wajib

1. Login dan autentikasi.
2. Dashboard keuangan.
3. Multi-wallet dan pencatatan aset.
4. Pemasukan, pengeluaran, dan transfer.
5. Financial goals dan alokasi dana.
6. Financial insights dan analisis pengeluaran.
7. AI copilot terintegrasi pada dashboard dan transaksi.
8. Bukti transaksi, audit trail, dan ekspor data.
9. PWA responsif dan instalasi ke perangkat yang mendukung.

AI bukan halaman navigasi tersendiri.

### Tidak termasuk MVP

- Sinkronisasi otomatis dengan BCA atau bank lainnya tanpa integrasi resmi.
- Pembayaran, transfer uang, atau akses untuk memindahkan dana sungguhan.
- Trading otomatis dan rekomendasi investasi yang menjanjikan keuntungan.
- AI agent yang melakukan perubahan finansial tanpa persetujuan pengguna.
- Multi-user collaboration dan fitur sosial.
- Integrasi berbayar yang wajib untuk menjalankan aplikasi.
- Sistem akuntansi bisnis yang kompleks.

---

## 4. Struktur Navigasi

Setelah login, aplikasi memiliki lima halaman utama. Login menjadi halaman terpisah.

### 4.1 Login

Fungsi:
- Login dan logout.
- Pemulihan akses sesuai dukungan penyedia autentikasi.
- Proteksi halaman privat.
- Penanganan sesi kedaluwarsa.

Ketentuan:
- Tidak ada kredensial rahasia yang ditanam di frontend.
- Tidak ada tombol login palsu.
- Data keuangan tidak boleh ditampilkan sebelum sesi terautentikasi.

### 4.2 Dashboard

Dashboard adalah ringkasan seluruh kondisi finansial.

Komponen:
- Total kekayaan bersih.
- Total aset dan kewajiban.
- Saldo per jenis akun.
- Pemasukan dan pengeluaran periode berjalan.
- Grafik cashflow.
- Ringkasan anggaran dan kategori pengeluaran.
- Goals aktif dan progres.
- Transaksi terbaru.
- AI copilot.
- Peringatan yang relevan.

Filter periode:
- Bulan ini.
- Bulan sebelumnya.
- Rentang tanggal khusus.

Dashboard tidak boleh memakai data dummy ketika berjalan dalam mode produksi.

### 4.3 Wallet

Wallet mengelola seluruh akun dan aset.

Jenis akun:
- Bank.
- E-wallet.
- Tunai.
- Tabungan.
- Reksa dana.
- Saham.
- Crypto.
- Aset lainnya.

Data setiap wallet:
- Nama.
- Jenis akun.
- Saldo atau nilai tercatat.
- Mata uang.
- Saldo terakhir yang diverifikasi.
- Waktu pembaruan terakhir.
- Sumber saldo.
- Status verifikasi.

Fungsi:
- Membuat dan mengedit wallet.
- Menambahkan saldo awal.
- Mencatat penyesuaian saldo dengan alasan.
- Transfer antarrekening.
- Rekonsiliasi dengan saldo aktual.
- Melihat riwayat transaksi.
- Melihat detail aset investasi.

Untuk investasi, pisahkan jumlah unit, harga per unit, nilai tercatat, dan biaya transaksi apabila datanya tersedia.

Saldo investasi manual harus diberi label sesuai waktu pembaruan. Jangan menyebut nilai tersebut real-time tanpa sumber data yang mendukung.

### 4.4 Pemasukan dan Pengeluaran

Fungsi:
- Tambah, edit, dan arsipkan transaksi.
- Catat pemasukan, pengeluaran, dan transfer.
- Kelola kategori dan subkategori.
- Tentukan wallet terkait.
- Catat tanggal transaksi dan tanggal pencatatan jika berbeda.
- Tambahkan catatan dan lampiran bukti.
- Cari dan filter transaksi.
- Impor mutasi CSV.
- Ekspor transaksi CSV.
- Input transaksi menggunakan bahasa alami melalui AI.

Data transaksi:
- ID.
- Tanggal transaksi.
- Jenis transaksi.
- Nominal.
- Wallet sumber.
- Wallet tujuan untuk transfer.
- Kategori.
- Deskripsi.
- Bukti transaksi opsional.
- Status verifikasi.
- Sumber pencatatan.
- Waktu pembuatan dan pembaruan.

Kategori awal dapat mencakup:
- Makanan.
- Kopi.
- Transportasi.
- Keluarga.
- Kebutuhan pribadi.
- Pendidikan.
- Tagihan.
- Hiburan.
- Kesehatan.
- Donasi.
- Investasi.
- Pendapatan gaji.
- Freelance.
- Pendapatan lainnya.

Pengguna harus dapat mengubah kategori sesuai kebutuhannya.

### 4.5 Goals

Pengguna dapat membuat tujuan keuangan dengan bahasa biasa atau form.

Data goal:
- Nama.
- Deskripsi.
- Target nominal.
- Tenggat waktu opsional.
- Prioritas.
- Nominal yang sudah dialokasikan.
- Status.
- Riwayat alokasi dan penarikan.

Fungsi:
- Buat, edit, selesaikan, dan arsipkan goal.
- Lihat progres.
- Tentukan kontribusi rutin.
- Simulasikan kebutuhan kontribusi berdasarkan tenggat.
- Lihat apakah target realistis berdasarkan cashflow.

Alokasi goal harus terpisah dari transaksi keuangan nyata.

Jangan menghitung uang yang sama sebagai dua aset berbeda hanya karena dialokasikan ke beberapa goal.

### 4.6 Insight

Insight memberikan analisis berdasarkan data aktual pengguna.

Fitur:
- Pemasukan dan pengeluaran per kategori.
- Tren bulanan.
- Rasio tabungan.
- Perubahan kekayaan bersih.
- Pengeluaran berulang.
- Analisis pengeluaran kopi dan kategori lain.
- Perbandingan anggaran dengan realisasi.
- Peringatan potensi defisit.
- Proyeksi cashflow sederhana.
- Berita dan edukasi keuangan dengan sumber serta tanggal publikasi.

Contoh insight:

"Pengeluaran kopi bulan ini Rp240.000, dibandingkan Rp160.000 pada bulan sebelumnya."

Insight seperti ini hanya boleh muncul jika angka dapat dihitung dari transaksi aktual dan periode pembanding yang valid.

Hindari memberikan label seperti "boros" atau "sehat" secara mutlak tanpa menjelaskan indikator yang digunakan.

Berita keuangan harus bersumber dari informasi yang dapat diverifikasi. Jika akses berita tidak tersedia, tampilkan status keterbatasan dengan jelas, bukan berita buatan AI.

---

## 5. AI Financial Copilot

### Tujuan

Memungkinkan pengguna mencatat transaksi dan memahami kondisi keuangan melalui percakapan alami.

### Kemampuan

- Memahami perintah pencatatan transaksi.
- Mengidentifikasi nominal, kategori, tanggal, dan wallet.
- Menanyakan informasi yang belum jelas.
- Menampilkan pratinjau transaksi.
- Meminta konfirmasi sebelum menyimpan.
- Menjawab pertanyaan berdasarkan data aktual.
- Mengingat preferensi dan tujuan finansial yang tersimpan.
- Memberikan saran yang menjelaskan asumsi dan dasar perhitungannya.

### Contoh interaksi

Pengguna:

"Tadi ngopi 25 ribu sama makan 15 ribu pakai BCA."

AI menyiapkan dua transaksi dengan total Rp40.000.

Sebelum penyimpanan, pengguna dapat memeriksa dan mengoreksi detailnya.

### Arsitektur AI

AI tidak boleh menjadi sumber kebenaran saldo atau transaksi.

Alur yang diwajibkan:

1. AI memahami permintaan.
2. Aplikasi memvalidasi hasil parsing.
3. Pengguna mengonfirmasi.
4. Backend menyimpan transaksi.
5. Sistem menghitung ulang saldo.
6. AI menjelaskan hasil berdasarkan data yang telah tersimpan.

Gunakan antarmuka provider yang modular agar model dapat diganti.

Mode tanpa AI tetap harus memungkinkan pencatatan manual, perhitungan saldo, goals, dan laporan.

### Memori

Simpan informasi yang memang dibutuhkan:
- Preferensi kategori.
- Tujuan finansial.
- Aturan budgeting.
- Preferensi komunikasi.
- Ringkasan konteks keuangan yang telah disetujui pengguna.

Jangan mengandalkan riwayat percakapan model sebagai satu-satunya penyimpanan memori.

---

## 6. Aturan Perhitungan Keuangan

Bagian ini kritis. Semua perhitungan harus diuji.

### 6.1 Saldo wallet

Saldo berjalan:

Saldo awal + pemasukan + transfer masuk - pengeluaran - transfer keluar + penyesuaian.

Setiap transaksi harus memengaruhi wallet yang benar.

### 6.2 Transfer

Transfer Rp500.000 dari BCA ke wallet tabungan:
- Saldo BCA berkurang Rp500.000.
- Saldo wallet tabungan bertambah Rp500.000.
- Total aset tidak berubah.
- Transfer tidak masuk sebagai pemasukan atau pengeluaran konsumsi.

Kedua sisi transfer harus terhubung dan konsisten.

### 6.3 Cashflow

Cashflow bersih = total pemasukan - total pengeluaran pada periode yang dipilih.

Transfer antarrekening dikecualikan dari pemasukan dan pengeluaran konsumsi.

Pembelian investasi harus diklasifikasikan terpisah dari konsumsi agar laporan tidak menyesatkan. Biaya transaksi investasi dicatat sesuai kategorinya.

### 6.4 Kekayaan bersih

Kekayaan bersih = total aset - total kewajiban.

Aset:
- Saldo rekening.
- Uang tunai.
- Investasi.
- Aset lain yang tercatat.

Kewajiban:
- Utang.
- Tagihan yang belum dibayar jika memang dicatat sebagai kewajiban.

Hindari menghitung satu aset dua kali.

### 6.5 Nominal uang

Gunakan integer dalam satuan rupiah untuk nilai uang yang tidak membutuhkan pecahan. Gunakan tipe numerik yang aman untuk nilai investasi dan presisi yang diperlukan.

Hindari floating-point untuk perhitungan uang yang membutuhkan ketepatan.

### 6.6 Riwayat dan koreksi

Perubahan saldo tidak boleh dilakukan tanpa jejak.

Koreksi harus menyimpan:
- Nilai sebelum perubahan.
- Nilai sesudah perubahan.
- Alasan.
- Waktu perubahan.
- Identitas pengguna yang melakukan perubahan.

Hindari penghapusan permanen yang membuat laporan historis tidak konsisten.

---

## 7. Arsitektur Teknologi

Gunakan stack berikut sebagai baseline MVP:

- Next.js dengan App Router.
- TypeScript dengan strict mode.
- Tailwind CSS.
- shadcn/ui.
- Supabase PostgreSQL.
- Supabase Auth.
- Supabase Storage untuk bukti transaksi jika kuota tersedia.
- Recharts untuk visualisasi.
- Zod untuk validasi.
- React Hook Form untuk form kompleks.
- PWA manifest dan service worker melalui implementasi yang terawat.
- GitHub untuk version control.
- Vercel Hobby untuk deployment personal nonkomersial, sesuai ketentuan paket.

Semua versi dependency harus ditentukan secara eksplisit dalam lockfile.

Sebelum memilih library tambahan, periksa apakah fungsi yang dibutuhkan sudah dapat dipenuhi oleh stack yang ada.

Jangan menambahkan dependency tanpa alasan teknis.

### Alternatif AI

Utamakan:
1. Mode tanpa AI sebagai fallback.
2. Provider API gratis yang tersedia dan sesuai ketentuannya.
3. Model lokal melalui Ollama apabila perangkat mendukung.

Jangan mengklaim AI gratis tanpa batas. Jika kuota habis atau model tidak tersedia, aplikasi tetap berfungsi untuk fitur non-AI.

### Prinsip PWA

- Responsif untuk mobile dan desktop.
- Bisa diinstal pada perangkat yang mendukung.
- Offline fallback yang jelas.
- Draft transaksi dapat dipertahankan secara lokal.
- Sinkronisasi draft harus mencegah duplikasi.
- Jangan menyimpan kredensial atau token sensitif sembarangan di browser.
- Jangan mengklaim sinkronisasi lintas perangkat berlangsung offline.

---

## 8. Model Data Awal

Rancang database dengan relasi dan constraint yang jelas.

### profiles
- id.
- display_name.
- preferred_currency.
- timezone.
- created_at.
- updated_at.

### wallets
- id.
- user_id.
- name.
- type.
- currency.
- opening_balance.
- archived_at.
- created_at.
- updated_at.

### transactions
- id.
- user_id.
- type.
- amount.
- transaction_date.
- category_id.
- wallet_id.
- transfer_group_id.
- description.
- source.
- verification_status.
- created_at.
- updated_at.
- archived_at.

### categories
- id.
- user_id.
- name.
- type.
- parent_id.
- created_at.

### transaction_evidence
- id.
- user_id.
- transaction_id.
- storage_path.
- file_type.
- created_at.

### balance_snapshots
- id.
- user_id.
- wallet_id.
- actual_balance.
- recorded_at.
- source.
- notes.

### goals
- id.
- user_id.
- name.
- description.
- target_amount.
- deadline.
- priority.
- status.
- created_at.
- updated_at.

### goal_allocations
- id.
- user_id.
- goal_id.
- wallet_id.
- amount.
- allocation_date.
- type.
- notes.

### financial_preferences
- id.
- user_id.
- preference_key.
- preference_value.
- updated_at.

### audit_logs
- id.
- user_id.
- entity_type.
- entity_id.
- action.
- before_data.
- after_data.
- created_at.

Tambahkan tabel AI conversation jika diperlukan, tetapi pisahkan data percakapan dari ledger finansial.

Semua tabel yang berisi data pengguna harus memiliki aturan kepemilikan yang konsisten.

Jangan menganggap skema ini final sebelum alur transfer, koreksi, dan pengarsipan diuji. Buat migration versioned dan constraint database untuk menjaga integritas data.

---

## 9. Keamanan dan Privasi

Wajib:
- Autentikasi untuk semua halaman privat.
- Row Level Security pada seluruh tabel finansial.
- Validasi input pada server.
- Authorization check untuk setiap operasi berdasarkan user_id.
- Secret dan service-role key tidak boleh berada di frontend.
- Upload file dibatasi berdasarkan tipe dan ukuran.
- File bukti tidak boleh memiliki akses publik secara default.
- Error response tidak membocorkan rahasia.
- Backup dan ekspor data tersedia.
- Tidak ada data finansial asli di repository atau seed production.
- Tidak mengirim data finansial ke AI eksternal tanpa mekanisme yang jelas dan persetujuan pengguna.

Jangan menggunakan data sensitif sungguhan selama pengembangan awal.

---

## 10. UI/UX dan Design System

### Arah visual

Bangun produk yang terasa seperti aplikasi finansial personal premium, bukan dashboard admin generik.

Karakter:
- Bersih.
- Tenang.
- Presisi.
- Tipografi kuat.
- Hierarki informasi jelas.
- Ruang kosong yang cukup.
- Kontras dan keterbacaan yang baik.

Gunakan warna netral sebagai fondasi dengan satu warna aksen yang konsisten. Warna positif dan negatif digunakan secara semantik, bukan dekoratif.

### Hindari

- Gradient di setiap kartu.
- Glassmorphism berlebihan.
- Emoji sebagai ikon navigasi.
- Terlalu banyak kartu tanpa hierarki.
- Grafik yang tidak membantu keputusan.
- Angka dummy yang terlihat seperti data nyata.
- Tombol tanpa fungsi.
- Placeholder yang tertinggal.
- Animasi berlebihan.
- Menyalin identitas visual produk referensi secara langsung.

### Komponen utama

- App shell dan navigasi responsif.
- Page header.
- Summary metrics.
- Transaction list.
- Wallet selector.
- Category selector.
- Date range filter.
- Goal progress.
- Confirmation dialog.
- Empty state.
- Loading state.
- Error state.
- Toast notification.
- AI chat panel.

Setiap halaman wajib memiliki loading, empty, success, dan error state yang sesuai.

---

## 11. Rencana Implementasi Modular

Jangan generate seluruh aplikasi sekaligus.

### Modul 0 — Project foundation

- Buat struktur proyek.
- Konfigurasi TypeScript dan linting.
- Setup design tokens.
- Setup environment variables.
- Buat app shell dan navigasi.
- Setup Supabase.
- Dokumentasikan cara menjalankan aplikasi.

Acceptance criteria:
- Aplikasi berjalan lokal.
- Tidak ada error build.
- Semua halaman memiliki routing yang benar.
- Tidak ada secret di repository.

### Modul 1 — Authentication dan database

- Login dan logout.
- Proteksi halaman.
- Migration database.
- RLS policies.
- Seed data demonstrasi yang terpisah dari data pengguna.

Acceptance criteria:
- Pengguna tidak dapat membaca atau mengubah data milik pengguna lain.
- Session dan logout bekerja.
- Migration dapat dijalankan ulang sesuai mekanisme migration.
- Tidak ada akses data privat tanpa autentikasi.

### Modul 2 — Wallet dan ledger

- CRUD wallet.
- Saldo awal.
- Transaksi.
- Transfer.
- Koreksi dan audit trail.
- Perhitungan saldo.
- Rekonsiliasi.

Acceptance criteria:
- Saldo setiap wallet konsisten dengan ledger.
- Transfer tidak mengubah kekayaan bersih.
- Koreksi dapat ditelusuri.
- Tidak ada transaksi duplikat akibat pengiriman berulang.
- Semua operasi penting memiliki automated tests.

### Modul 3 — Cashflow

- Filter tanggal.
- Kategori.
- Pemasukan dan pengeluaran.
- Grafik cashflow.
- Impor dan ekspor CSV.
- Bukti transaksi.

Acceptance criteria:
- Nilai laporan sama dengan hasil agregasi ledger.
- Transfer dikecualikan dari cashflow konsumsi.
- Format CSV yang tidak valid ditolak dengan pesan yang jelas.
- Data impor dapat diperiksa sebelum disimpan.

### Modul 4 — Goals

- CRUD goals.
- Alokasi dan pelepasan alokasi.
- Progres.
- Simulasi kontribusi.
- Hubungan dengan wallet dan saldo tersedia.

Acceptance criteria:
- Alokasi tidak menggandakan aset.
- Progres dihitung dari alokasi yang valid.
- Goal tidak membuat transaksi palsu.
- Penarikan alokasi memiliki jejak perubahan.

### Modul 5 — Insight

- Analisis kategori.
- Tren bulanan.
- Rasio tabungan.
- Perbandingan anggaran dan realisasi.
- Peringatan cashflow.
- Net worth history.
- Berita dengan sumber eksternal jika tersedia.

Acceptance criteria:
- Setiap insight bisa ditelusuri ke data atau sumbernya.
- Periode pembanding dijelaskan.
- Tidak ada insight yang dibuat dari data kosong.
- Keterbatasan data dinyatakan secara eksplisit.

### Modul 6 — AI copilot

- Chat UI.
- Parsing transaksi.
- Konfirmasi sebelum penyimpanan.
- Tool/function calls yang dibatasi.
- Financial context retrieval.
- Memory yang dapat dikelola pengguna.
- Fallback saat AI tidak tersedia.

Acceptance criteria:
- AI tidak menyimpan transaksi tanpa persetujuan.
- AI tidak dapat melewati otorisasi server.
- AI tidak menghitung saldo secara mandiri.
- Hasil parsing yang ambigu memicu pertanyaan klarifikasi.
- Fitur inti tetap berjalan ketika AI gagal.

### Modul 7 — PWA, reliability, dan deployment

- Manifest.
- Installability.
- Offline fallback.
- Draft handling.
- Backup dan restore.
- Security review.
- Responsive testing.
- Deployment dan dokumentasi.

Acceptance criteria:
- PWA dapat diinstal pada browser/perangkat yang mendukung.
- Draft tidak hilang secara tidak terduga.
- Sinkronisasi tidak menggandakan transaksi.
- Backup dapat dipulihkan.
- Tidak ada error kritis pada alur utama.

---

## 12. Testing Wajib

Buat unit test, integration test, dan end-to-end test untuk alur kritis.

Skenario minimum:
1. Membuat wallet dengan saldo awal.
2. Menambahkan pemasukan.
3. Menambahkan pengeluaran.
4. Transfer antarrekening.
5. Membatalkan atau mengoreksi transaksi.
6. Menghitung cashflow per bulan.
7. Menghitung kekayaan bersih.
8. Membuat goal dan mengalokasikan dana.
9. Mengimpor CSV dengan baris invalid.
10. Mengakses data dengan user yang salah.
11. Memproses transaksi melalui AI.
12. Menangani AI timeout.
13. Memastikan retry tidak menggandakan transaksi.
14. Memulihkan backup.
15. Memastikan saldo dan laporan tetap konsisten setelah perubahan data.

Gunakan nominal rupiah yang realistis untuk pengujian, tetapi jangan memakai data finansial asli.

---

## 13. Definition of Done

Sebuah modul dianggap selesai hanya jika:

- Fungsi utama benar-benar bekerja.
- Validasi input dan error handling tersedia.
- UI responsif.
- Tidak ada data dummy di alur produksi.
- Unit/integration tests relevan lulus.
- Akses data sudah diverifikasi.
- Tidak ada secret yang terekspos.
- Dokumentasi penggunaan diperbarui.
- Tidak ada dependency yang ditambahkan tanpa alasan.
- Build dan lint berhasil.
- Perubahan dapat dijelaskan dan dipahami developer.

Jangan menandai modul selesai hanya karena halaman berhasil dirender.

---

## 14. Aturan Kerja Coding Agent

1. Baca seluruh PRD sebelum melakukan perubahan.
2. Periksa repository dan environment yang sudah ada.
3. Jangan menghapus atau menimpa file tanpa memahami fungsinya.
4. Buat implementation plan sebelum coding.
5. Kerjakan satu modul per iterasi.
6. Jelaskan keputusan arsitektur yang berdampak besar.
7. Hindari refactor besar yang tidak terkait dengan task.
8. Jangan membuat API, integrasi bank, atau AI yang sebenarnya belum tersedia.
9. Jangan menyembunyikan error dengan fallback palsu.
10. Jangan menggunakan mock data pada production path.
11. Jalankan lint, typecheck, tests, dan build yang relevan.
12. Laporkan file yang berubah, hasil verifikasi, masalah yang tersisa, dan langkah selanjutnya.
13. Jika ada informasi yang belum pasti, periksa dokumentasi atau ajukan pertanyaan sebelum membuat asumsi berisiko.
14. Utamakan kode sederhana, modular, dan mudah dipelajari daripada abstraksi berlebihan.

---

## 15. Indikator Keberhasilan MVP

TamaWallet dinyatakan layak digunakan jika pengguna dapat:

- Mengakses aplikasi dengan aman.
- Mengelola beberapa wallet.
- Mencatat transaksi dengan cepat.
- Melihat cashflow dan saldo yang konsisten.
- Melacak aset, kewajiban, dan kekayaan bersih.
- Membuat serta memantau goals.
- Memahami pola pengeluaran dari insight.
- Menggunakan AI tanpa menyerahkan kontrol atas transaksi.
- Mengekspor dan memulihkan data.
- Menggunakan fitur inti tanpa membayar langganan AI.

**Prioritas mutlak: akurasi keuangan > keamanan > kegunaan > AI > fitur tambahan.**

TamaWallet harus menjadi alat yang dapat dipercaya, bukan sekadar demo visual.
