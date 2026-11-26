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

## Sistem Exit UI Cadangan (Fasa Tambahan)

### URD
- **URD-EX1** Pengunjung dalam UI Cadangan (mod ringkas) boleh **keluar** dan kembali ke UI penuh dengan satu butang.

### ADD
- **ADD-EX1** Butang **"Keluar UI Cadangan"** dalam header `SimpleHome` (sebelah pill "Mod ringkas stabil"): panggil `setUiMode("full")` → `localStorage "md-ui-mode"` dikemas kini + CustomEvent `md-ui-mode` disiar → UI penuh dipapar serta-merta tanpa muat semula.
- **ADD-EX2** SFX `toggle-off` dimainkan melalui delegasi global (`data-sfx`).
- **ADD-EX3** Laluan masuk mod ringkas tidak berubah: ikon amaran → panel → "Guna UI Cadangan", atau butang "Guna UI Cadangan" pada kad ralat Error Boundary.

### TDD
- **TDD-EX1** Butang hanya wujud dalam UI Cadangan; UI penuh kekal menggunakan ikon amaran untuk menukar mod.
- **TDD-EX2** Pilihan diingati: selepas keluar, muat semula seterusnya kekal ke UI penuh.

## Had Penggunaan Kod Redeem (Fasa Tambahan)

### URD
- **URD-LM1** Kod `ADMINSERVER`: boleh digunakan **10 kali sehari** dan ada **had mingguan** (30×/minggu); **reset minggu hadapan** (automatik, Isnin–Ahad).
- **URD-LM2** Kod `SERVERFREE`: memaparkan **100 Pokémon sekaligus**, boleh digunakan **5 kali** dengan **had bulanan**; **reset bulan hadapan** (automatik, hari 1).

### ADD
- **ADD-LM1** `CODE_LIMITS` dalam `admin-access.ts`: `ADMINSERVER { accessLimit: 40, daily: 10, weekly: 30, monthly: ∞ }`, `SERVERFREE { accessLimit: 100, daily: ∞, weekly: ∞, monthly: 5 }` — mudah diubah.
- **ADD-LM2** Kiraan penggunaan per kod dalam `localStorage "md-admin-usage"` dengan kunci tingkap bergulir: harian (`YYYY-MM-DD`), mingguan (Isnin minggu itu), bulanan (`YYYY-MM`). Bila kunci tingkap bertukar, kiraan **reset automatik** (bukan manual).
- **ADD-LM3** `checkLimits()` disemak sebelum redeem: paparan mingguan → harian → bulanan dengan mesaj khusus (cth. "Had mingguan ADMINSERVER tercapai (30×/minggu) — reset secara automatik pada minggu hadapan.").
- **ADD-LM4** Setiap redeem yang berjaya merekod 1 penggunaan pada semua tingkap yang berkuatkuasa; akses sedia ada kekal aktif walaupun had tercapai lewat.
- **ADD-LM5** Banner akses memapar **baki** semasa: ADMINSERVER "Baki: X/10 hari ini · Y/30 minggu ini"; SERVERFREE "Baki bulan ini: Z/5". "Rawak semula" tidak merekod penggunaan (permainan semula set 40/100 sedia ada).

### TDD
- **TDD-LM1** Redeem ke-11 dalam hari yang sama (ADMINSERVER) ditolak dengan mesj had harian; redeem pertama esok diizinkan.
- **TDD-LM2** Redeem ke-6 dalam bulan yang sama (SERVERFREE) ditolak dengan mesj had bulanan; reset pada hari 1 bulan hadapan.
- **TDD-LM3** Akses SERVERFREE memilih 100 ID unik; ADMINSERVER kekal 40.

## Dialog Redeem v2 (Fasa Tambahan)

### URD
- **URD-RD1** UI redeem lebih kemas dan estetik; setiap tindakan mesti ada **maklum balas jelas** (kejayaan/ralat/had).

### ADD
- **ADD-RD1** Butang berinkan ikon kunci "Guna Kod Redeem" dalam kad DITUTUP membuka **dialog M3** (overlay kabur, kad `rounded-[28px]` shadow-e3, `role="dialog" aria-modal`): tutup dengan butang X, **Batal**, klik latar, atau **Escape**; input autofokus, auto-uppercase.
- **ADD-RD2** Dialog papar dua kad fasiliti tanpa mendedahkan kod ("Akses Piawai" 40 · 10×/hari · 30×/minggu; "Akses Lanjutan" 100 · 5×/sebulan).
- **ADD-RD3** Semasa menaip kod yang sah, **baki langsung** dipapark (tertiary); ralat papar mesaj khusus dalam warna `--md-error` (`role="alert"`) — kod salah, kod kosong, had harian/mingguan/bulanan; butang Redeem dinyahaktif bila input kosong.
- **ADD-RD4** Kejayaan: SFX success + kad DITUTUP diganti Banner Akses + Pokédex terhad serta-merta pada posisi skrol yang sama.
- **ADD-RD5** Panggilan redeem dibalut try/catch — ralat tidak dijangka dipapar sebagai mesj, bukan kegagalan senyap.

### TDD
- **TDD-RD1** Dialog tidak wujud dalam HTML SSR (hanya selepas klik butang); smoke SSR mengesan butang "Guna Kod Redeem".
- **TDD-RD2** `tsc --noEmit` dan `next build` (statik) lulus.
