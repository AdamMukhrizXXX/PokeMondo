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

## Sistem UI Cadangan (Fasa Tambahan)

### URD
- **URD-UC1** Jika UI utama bug/ralat, pengunjung masih boleh memakai UI Cadangan.

### ADD
- **ADD-UC1** `ErrorBoundary` (class React, tiada dependencies) melindungi setiap seksyen: Hero, Galeri, Pokédex, Info, Jam Dunia, Pemain Muzik, Navigasi, Modal Butiran, dan kawalan penjuru atas.
- **ADD-UC2** Fallback lalai: kad M3 dengan ikon amaran, mesaj ringkas, butang **Cuba semula** (reset state) dan **Guna UI Cadangan** (`setUiMode("simple")`), plus butiran ralat tersembunyi (`<details>`).
- **ADD-UC3** Ikon amaran kekal di penjuru atas kanan membuka panel status mod: tukar penuh↔ringkas; titik oren bila UI Cadangan aktif; diingati melalui `localStorage "md-ui-mode"` + CustomEvent `md-ui-mode`.
- **ADD-UC4** `SimpleHome` ialah UI Cadangan: input carian (sila `simplify()`), penapis jenis `<select> asli`, pagination asas (60/halaman), grid sprite 1,025 Pokémon, dan `DetailModal` yang sama — sifar rAF/IO/animasi berat.
- **ADD-UC5** Ralat dicetak ke konsol (`componentDidCatch`) untuk debug tanpa meranapkan halaman.

### TDD
- **TDD-UC1** SSR lalai = UI penuh; mod ringkas hanya aktif selepas mount jika localStorage pernah ditetapkan (hydration-safe).
- **TDD-UC2** Boundary terpencil: ralat satu seksyen hanya gantikan seksyen itu.

## Sistem AI Anal Pokémon (Fasa Tambahan)

### URD
- **URD-AI1** Sistem AI boleh menganalisis semua 1,025 Pokémon. Wajib **AI sebenar** (API model bahasa), bukan AI bawaan/lokal.

### ADD
- **ADD-AI1** Bawa-kunci-anda-sendiri (BYOK) melalui `fetch` langsung — tiada dependencies baharu. 4 penyedia: **Mistral** (`api.mistral.ai/v1/chat/completions`, lalai `mistral-small-latest`), **Google Gemini** (`generativelanguage.googleapis.com/v1beta/...:generateContent`, lalai `gemini-2.0-flash`), **OpenAI** (`api.openai.com/v1`, lalai `gpt-4o-mini`), **OpenRouter** (`openrouter.ai/api/v1`, header `X-Title`, lalai model percuma).
- **ADD-AI2** Kunci/penyedia/model disimpan hanya dalam `localStorage` (`md-ai-key`, `md-ai-provider`, `md-ai-model`) dan dihantar terus ke penyedia oleh pelayar pengunjung — tiada pelayan perantara, tiada kunci dikodkan.
- **ADD-AI3** `datasetSummary(list)` mengira statistik dataset (kiraan per generasi, frekuensi jenis 6 teratas, pasangan dwi-jenis teratas, jumlah dwi-jenis) dan dihantar sebagai konteks bersama setiap soalan; system prompt bahasa Melayu dengan arahan anti-halusinasi.
- **ADD-AI4** UI `AiAssist`: ikon sparkle di penjuru atas kanan (dalam `ErrorBoundary label="AI Anal"`), panel dua tab — **Sembang** (butang "Analisis Semua Pokémon (1,025)", 4 cadangan soalan, textarea Enter=hantar) dan **Tetapan** (penyedia, model, kunci, simpan/padam). Titik oren bila kunci aktif. Ralat NO_KEY/HTTP/CORS dipaparkan dalam gelembung mesaj.

### TDD
- **TDD-AI1** Statik: semua panggilan dilakukan dari klien selepas mount; SSR hanya memaparkan ikon.
- **TDD-AI2** Kunci tidak pernah muncul dalam gelembung sembang atau konsol; medan kunci ialah password dan dikosong selepas simpan.
- **TDD-AI3** Tiada key = `NO_KEY` (mesaj panduan membuka tab Tetapan); ralat HTTP memapar status + potongan badan respons.
