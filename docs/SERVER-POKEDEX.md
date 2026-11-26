# Sistem Server Pokédex (Ditutup sehingga 31 Disember 2027)

## URD (Keperluan Pengguna)
- **URD-SP1** Tambah sistem: Server Pokédex **ditutup** sehingga **31 Disember 2027**, kemudian terbuka semula secara **automatik** (bukan manual).
- **URD-SP2** Pengunjung dapat melihat status pelayan dan **kiraan detik** (hari/jam/minit/saat) sehingga tarikh pembukaan.

## ADD (Keputusan Reka Bentuk)
- **ADD-SP1** `src/lib/pokedex-server.ts`: `CLOSED_UNTIL = 31 Dis 2027, 23:59:59.999` (waktu tempatan pelayar). `getServerStatus()` → `{closed, until, msLeft}`; status dikira pada masa nyata setiap saat — selepas tarikh itu, pelayan **terbuka automatik** tanpa deploy baharu (statik, logika atas klien).
- **ADD-SP2** Bila tertutup: seksyen Pokédex digantikan kad **PokedexClosed** (M3) — pill "STATUS PELAYAN: DITUTUP" warna error, ikon kunci, mesaj, kiraan detik langsung (`useCountdown`, tick 1 saat, tabular-nums, `role="timer"`).
- **ADD-SP3** UI Cadangan (`SimpleHome`) juga dipaparkan status penutupan (banner) dan grid/halaman disembunyikan supaya konsisten — tiada pengecualian ketika UI terdegradasi.
- **ADD-SP4** Sistem lain tidak terjejas: Hero, Galeri Generasi, Pemain Muzik, Jam Dunia, SFX, AI Anal, Latar Custom tetap berfungsi.
- **ADD-SP5** Override pemilik (tanpa UI, didokumenkan sahaja): `localStorage.setItem("md-pokedex-force", "open")` membuka Pokédex sebelum tarikh; `removeItem` mengembalikan penutupan.
- **ADD-SP6** CustomEvent `md-server-status` (detail: status) dihantar ke `window` bila status bertukar, untuk integrasi masa depan.

## MDD (Data)
- Tiada simpanan data baharu; force override dalam `localStorage` kunci `md-pokedex-force`.

## TDD (Ujian)
- **TDD-SP1** Statik + hydration-safe: SSR dan mount pertama papar DITUTUP (masa kini < 2027); kiraan detik hanya berjalan selepas mount.
- **TDD-SP2** Bila `Date.now() > CLOSED_UNTIL`, status berubah menjadi TERBUKA pada kitaran 1 saat berikutnya tanpa muat semula.
- **TDD-SP3** `npx tsc --noEmit`, `next build` (statik) dan smoke SSR lulus.

## Sistem Akses Admin Redeem (Fasa Tambahan)

### URD
- **URD-AR1** Akses admin/default dengan **kod redeem rahsia** untuk akses percuma pelayan walaupun tertutup.
- **URD-AR2** Dua kod sahaja: `ADMINSERVER` dan `SERVERFREE` (tak peka huruf besar/kecil).
- **URD-AR3** Akses percuma **hanya memaparkan 40 Pokémon rawak** — bukan penuh 1,025.

### ADD
- **ADD-AR1** `src/lib/admin-access.ts`: `redeemCode()` sahkan kod (Normalize + UPPERCASE) terhadap `["ADMINSERVER","SERVERFREE"]` kod; bila sah, pilih **40 ID rawak** (Fisher–Yates shuffle pada pool 1,025) dan simpan `{code, ids}` dalam `localStorage "md-admin-access"` — kekal selepas muat semula.
- **ADD-AR2** UI: borang **Redeem** dalam kad PokedexClosed ("Ada kod redeem?"); sah → SFX `success` + pelayan buka mod terhad; tidak sah → SFX `error` + mesaj `role="alert"`.
- **ADD-AR3** `AdminBanner` di atas Pokédex: papar kod aktif, bilangan (40), butang **Rawak semula** (40 baru, SFX dadu) dan **Tamat akses** (buang localStorage → kembali ke kad DITUTUP).
- **ADD-AR4** Mod terhad mengikat semua laluan data: grid + carian + penapis + halaman membaca `dexList` (40 sahaja), butang **Rawak** di penjuru atas memilih dari 40 itu, dan UI Cadangan (SimpleHome) menerima senarai terhad yang sama.
- **ADD-AR5** Bila pelayan telah dibuka sebenar (selepas 31 Dis 2027), akses redeem tidak memberi apa-apa kesan (senarai penuh terbuka); akses hanya relevan semasa tertutup.

### TDD
- **TDD-AR1** Kod salahhuruf (cth. `adminserver`, ` ServerFree `) tetap diterima; kod lain ditolak.
- **TDD-AR2** 40 ID sentiasa unik dan subset pool; "Rawak semula" menghasilkan set berbeza (secara stokastik).
- **TDD-AR3** `tsc --noEmit`, `next build` (statik) dan smoke SSR lulus.
