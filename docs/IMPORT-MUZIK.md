# Import Muzik — Pemain OST PokeMondo

Dokumen reka bentuk ciri mengikut format URD / ADD / MDD / TDD (dipadatkan, prinsip Ockham: satu dokumen, ID stabil, tiada pengulangan).

## URD — Keperluan Pengguna

| ID | Keperluan |
| --- | --- |
| URD-IM1 | Pengguna boleh **import fail muzik Pokémon sendiri** (mp3/ogg/m4a/wav/flac/opus) dari peranti ke dalam pemain muzik laman. |
| URD-IM2 | Import **kekalan** — trek yang diimport masih ada selepas refresh pelayar (per pelayar, tanpa pelayan). |
| URD-IM3 | Trek import berintegrasi penuh dengan pemain sedia ada: main/jeda, auto-tukar (auto-next), putar rawak, seek, kelantangan, Media Session. |
| URD-IM4 | Pengguna boleh **padam** trek import individually. |
| URD-IM5 | Fail bukan-audio atau melebihi had saiz ditolak dengan pesanan jelas (Bahasa Melayu). |
| URD-N1 | Tiada dependensi baharu; tiada muat naik ke pelayan luar (privasi: fail kekal dalam pelayar pengguna). |

## ADD — Seni Bina

| ID | Keputusan |
| --- | --- |
| ADD-IM1 | Penyimpanan: **IndexedDB** (`pokemondo-bgm`, store `tracks`) — blob audio + metadata. Lapisan: `src/lib/import-db.ts`. |
| ADD-IM2 | Model trek diperluas: `BgmTrack { id, title, game, url? }`; trek remote = `url` raw.githubusercontent, trek import = `id` berprefiks `imp-` diselesai kepada URL blob secara lazy (cache Map + `revokeObjectURL` pada padam). |
| ADD-IM3 | Playlist = 177 trek remote + trek import (disulai mengikut masa import). Semua fungsi sedia ada (next/prev/shuffle/duck/Media Session) beroperasi atas playlist gabungan. |
| ADD-IM4 | UI: seksyen "Muzik import" dalam kad pemain terkembang — butang Import (input file tersembunyi, `multiple`), senarai trek boleh skrol (maks 36) dengan main & padam, mesej ralat/validation, token ralat M3 baharu `--md-error`. |

## MDD — Butiran Modul

| ID | Kontrak |
| --- | --- |
| MDD-IM1 | `import-db.ts`: `isImportSupported()`, `putImported(file, title) → ImportedMeta {key,title,size,addedAt}`, `listImported() → ImportedMeta[]`, `deleteImported(key)`, `getBlobUrl(key) → string|null` (cache). |
| MDD-IM2 | `bgm.ts`: `addImportedBgm(ImportedMeta[])`, `removeImportedBgm(key)` (padam trek semasa → main seterusnya), `playBgmById(id)`, `getBgmTrack()` diclamp; `useBgmState` tambah `count`. |
| MDD-IM3 | Validasi: `type.startsWith("audio/")` ATAU sambungan `.mp3|.ogg|.oga|.m4a|.aac|.wav|.flac|.opus`; saiz ≤ 25MB; judul dipretifikasi (buang sambungan, `_`/`-` → ruang, Title Case). |

## TDD — Ujian

| ID | Kes | Status |
| --- | --- | --- |
| TDD-IM1 | `tsc --noEmit` — tiada ralat jenis | lulus |
| TDD-IM2 | `next build` — prerender statik berjaya; SSR memaparkan pill collapsed (seksyen import hanya dilukis selepas kembang) | lulus |
| TDD-IM3 | Logik pilihan playlist: indeks modul terus sah selepas tambah/padam trek import | lulus (semakan manual kod + jalan rAF) |
| TDD-IM4 | Ujian pelayan pengguna: import mp3 → main mula; refresh → trek masih tersenarai (IndexedDB); padam → hilang | menunggu pengesahan pengguna |
