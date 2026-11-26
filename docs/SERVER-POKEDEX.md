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
