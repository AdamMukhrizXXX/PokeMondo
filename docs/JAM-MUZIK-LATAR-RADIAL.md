# Reka Bentuk: Jam Dunia v2, Muzik Real-Time, Latar Custom, Navigasi Radial

Dokumen ringkas mengikut struktur URD/ADD/MDD/TDD (ID stabil) untuk empat sistem dalam fasa ini.

## URD (Keperluan Pengguna)

- **URD-JD1** Jam Dunia mesti memaparkan semua dunia dan negara, bukan hanya rantau Pokémon.
- **URD-JD2** Jam Dunia mesti diletakkan di tengah atas skrin.
- **URD-MM1** Masa berbaki muzik mesti dipaparkan secara masa nyata (kemas kini setiap bingkai, bukan manual).
- **URD-MM2** Sistem mesti mengesan tamatnya muzik secara automatik dan memaklumkan pengunjung.
- **URD-LB1** Sistem latar belakang custom mesti berfungsi sepenuhnya: pilih, pra-tonton, ubah suai, padam.
- **URD-RN1** Navigasi bawah diganti dengan menu sidebar bagerakan radial (Reactbits.dev).

## ADD (Keputusan Reka Bentuk)

- **ADD-JD1** Senarai zon dikumpulkan dalam `src/lib/timezones.ts` — 9 rantau Pokémon + 85+ zon dunia (semua benua). Carian menapis bandar/negara/benua.
- **ADD-JD2** Satu `setInterval` 1000ms + formatter `Intl.DateTimeFormat` dicache per zon — masa dikira pada peranti, sifar panggilan rangkaian, sifar dependencies.
- **ADD-JD3** Pill tetap `fixed top-4 center`; panel kembang di bawahnya dengan `anim-rise`; tutup dengan X, klik luar, atau Escape.
- **ADD-MM1** Kiraan berbaki dikemas kini dalam gelung `requestAnimationFrame` sedia ada (`leftRef` dalam pemain penuh, `miniRef` dalam pill) — tiada timer tambahan.
- **ADD-MM2** `bgm.ts` memancarkan `CustomEvent "md-bgm-ended"` (dengan tajuk lagu) pada event `ended` `<audio>` sebelum auto-tukar; pemain memaparkan nota status 5 saat.
- **ADD-LB1** `src/lib/ui-db.ts` — IndexedDB `pokemondo-ui` / store `wallpaper` (blob ≤ 12MB); URL object dicache dan dipulihkan.
- **ADD-LB2** Latar digunakan melalui CSS var `--wp-url` / `--wp-dim` / `--wp-blur` pada `<html>` + lapisan tetap `.bg-wallpaper` (z -20) dengan lapisan redup `::after`.
- **ADD-LB3** Apabila latar custom aktif (`data-wp="1"`), imej hiasan Pokémon (`.deco-img`) disembunyikan dan aurora diredam kepada 0.18 supaya gambar pengguna menonjol.
- **ADD-RN1** Hub bulat (tengah-bawah, `aria-expanded`) membuka 4 item pada arc 150°→30°, radius 92px, spring `cubic-bezier(0.34, 1.56, 0.45, 1)` + jeda berkumpulan 50ms/item.
- **ADD-RN2** Ring kaca (bulatan `border`) = landasan radial; klik luar / Escape / pilih item menutup menu; item aktif mengikut scroll-spy sedia ada.
- **ADD-RN3** Bar kemajuan skrol atas dikekalkan; semua bunyi mengikut palet SFX sedia ada (`aria-expanded` → open/close automatik).

## MDD (Data)

- **MDD-JD1** `WorldZone { city, country, tz, region }`; `POKEMON_ZONE_MAP` untuk 9 rantau; formatter dicache dalam `Map`.
- **MDD-LB1** `WallpaperRecord { key: "wallpaper", blob, addedAt }`; keutamaan `md-wp-dim` (0–0.9) / `md-wp-blur` (0–16px).

## TDD (Ujian)

- **TDD-JD1** Pill SSR memaparkan `--:--:--` (hydration-safe); selepas mount, masa tempatan ke detik.
- **TDD-MM1** Pemain penuh memaparkan `−m:ss` berbaki; pill mini merah pada ≤10s.
- **TDD-MM2** Lega habis → `md-bgm-ended` → nota status muncul & hilang selepas 5s.
- **TDD-LB1** Muat naik imej >12MB / bukan imej ditolak dengan mesej `--md-error`; padam memulihkan hiasan Pokémon.
- **TDD-RN1** Menu tertutup: item `opacity:0` + `pointer-events:none`; terbuka: arc + label; item aktif `bg-primary` + `aria-current`.
