# PokeMondo

Pokédex web penuh — semua 1,025 Pokémon dari sembilan generasi terus dari [PokéAPI](https://pokeapi.co), dibina dengan Next.js 15, React 19, TypeScript, dan Tailwind CSS 4.

## Ciri

- **Hero Section** — headline "Seribu Wajah. Satu ___" dengan **teks 3D bergerak** (extrude shadow + float 3D + parallax tilt mengikut tetikus) dan **kata hidup (live text)** yang bertukar sendiri — Legenda / Cerita / Petualangan / Misteri / Keajaiban; latar aurora tonal, kaunter animasi, dan bar carian yang menapis Pokédex secara langsung.
- **Pokédex penuh** — 1,025 spesies dimuat sekali melalui GraphQL PokéAPI (dengan sandaran REST), carian nama/nombor, penapis jenis dan generasi, susunan menaik/menurun.
- **Galeri Scroll Velocity** — dua baris teks berhalaju ikut kelajuan skrol + sembilan kad generasi (snap, paralaks artwork) menuju bahagian Pokédex.
- **Halaman berasingan** — Rumah, Galeri, Kuiz, Pokédex, dan Info kini laman App Router berasingan (`/`, `/galeri`, `/kuiz`, `/pokedex`, `/info`) dengan metadata tersendiri; carian Hero terus mula menapis di `/pokedex?q=…`, dan kad Terokai menghubungkan setiap halaman.
- **Staggered Menu** (reactbits.dev) — menu sidebar sebenar tanpa GSAP untuk navigasi halaman: dua prelayer M3 meluncur bertingkat, panel kaca `clamp(260px, 38vw, 420px)`, item navigasi besar uppercase dengan stagger label + penomboran `01–05`, teks toggle `Menu↔Close` bergilir dan ikon plus berputar menjadi X; item aktif mengikut laluan semasa (auto tutup semasa navigasi). Butang toggle di penjuru kiri atas — hanya **ikon Muzik** kekal di kanan atas.
- **Dok Kawalan (Navbar Bottom Live Motion)** ‗ semua kawalan (Bunyi, Cerah/Gelap, Tema Laman, Latar Custom, UI Cadangan, AI Anal, Rawak) dalam dok kaca tengah-bawah: masuk meluncur spring, item stagger, tooltip di atas, butang terangkat semasa hover, dadu Rawak berayun — boleh tatal pada skrin kecil.
- **Modal Butiran** — statistik penuh, genus, flavor text, kebolehan, dan navigasi sebelum/seterusnya untuk mana-mana Pokémon.
- **Sistem Suara Pokémon** — suara seruan (cry) untuk semua 1,025 Pokémon dari PokéAPI cries, dimainkan melalui Web Audio API dengan satu AudioContext kongsi, cache AudioBuffer, fade halus, butang main pada setiap kad, penderak animasi dalam modal (autoplay), dan butang mute global yang diingati.
- **Pemain Muzik OST** — 177 runtutan muzik latar dari siri permainan Pokémon (Red/Blue hingga Legends Z-A) distrim sebagai latar belakang: main/jeda, lagu sebelum/seterusnya, **auto-tukar lagu** apabila tamat, putar rawak, cuba-semula, kelantangan, Media Session (kawalan skrin kunci), dan bunyi diredam (duck) seketika bila seruan Pokémon dimainkan. **Import Muzik**: muat naik fail OST Pokémon anda sendiri (mp3/ogg/m4a/wav/flac, ≤ 25MB) dari peranti — disimpan kekal dalam pelayar (IndexedDB), boleh dimain/dipadam, dan terjana dalam auto-tukar serta putar rawak. Kredit muzik: Nintendo / Game Freak / The Pokémon Company.
- **SFX Butang** — palet penuh kesan bunyi sintesis Web Audio (tiada fail): klik, toggle hidup/mati, buka/tutup modal & pemain muzik, tick penomboran, arpeggi Rawak, jaya/gagal import, dan denyut hover halus — semua melalui delegasi global (termasuk papan kekunci Enter/Space), mengikut toggle Bunyi, dan boleh disenyapkan dengan `data-no-sfx`.
- **Jam Dunia (tengah-atas)** — jam masa nyata semua dunia: 9 rantau Pokémon + 85+ zon dunia (semua benua & negara utama) dengan carian negara/bandar, titik siang/malam, dan kemas kini setiap saat — tiada panggilan rangkaian.
- **Latar Custom** — pengunjung boleh memuat naik gambar sendiri sebagai latar belakang web (maks 12MB), disimpan kekal dalam pelayar (IndexedDB), dengan kawalan keamatan dan kabur (blur); imej hiasan Pokémon lalai tersembunyi secara automatik apabila latar custom aktif.
- **Deteksi tamat muzik** — kiraan detik masa berbaki ditunjuk secara masa nyata (pill mini & pemain penuh), dan apabila lagu tamat sistem mengesan secara automatik serta menunj: "… tamat — auto tukar ke lagu seterusnya".
- **Server Terbuka** — pelayan Pokédex terbuka sentiasa untuk semua 1,025 Pokémon; sistem penutupan & kod redeem telah ditarik balik.
- **3 Tema Laman** — tukar wajah laman dari menu radial: **Hand-Drawn** (kertas krim, fon tulisan tangan Caveat, sempadan putus), **Liquid Glass** (permukaan lut sinar berlapis cahaya), dan **Bauhaus** (bentuk berani, warna utama merah/kuning/biru, penjuru tegas) — diingati dalam pelayar dan serasi mod cerah/gelap.
- **Kuiz Rawak Tanpa Had** — teka siluet Pokémon dengan 4 pilihan; soalan baharu terjana setiap kali daripada 1,025 spesies, skor + rentetan + rekod terbaik, SFX jaya/gagal.
- **Sistem UI Cadangan** — jika UI utama bermasalah, setiap seksyen dilindungi Error Boundary: kad ralat dengan ikon amaran muncul di tempatnya lengkap butang "Cuba semula" dan "Guna UI Cadangan". UI Cadangan ialah versi ringkas stabil (carian, penapis jenis, halaman, sprite, modal butiran) tanpa animasi; boleh ditukar/balik melalui ikon amaran di penjuru atas kanan, pilihan diingati dalam pelayar, dan UI Cadangan mempunyai butang **Keluar UI Cadangan** untuk kembali ke UI penuh serta-merta.
- **AI Anal Pokémon** — analisis semua 1,025 Pokémon dengan **AI sebenar** (API model bahasa): bawa-kunci-anda-sendiri (BYOK) — pengunjung masukkan kunci API mereka sendiri (Mistral AI, Google Gemini, OpenAI, atau OpenRouter), disimpan hanya dalam pelayar; statistik dataset (jenis, generasi, dwi-jenis) dihantar sebagai konteks bersama setiap soalan, dengan butang analisis pantas + sembang penuh.
- **Tema Material You** — sistem token M3 (surface tonal, container, outline), mod cerah/gelap dengan kekal pilihan pengguna, ripple pada butang, sudut besar, dan warna dinamik mengikut jenis Pokémon.

- **Prestasi** — animasi hormat `prefers-reduced-motion`, gelung rAF galeri berhenti bila tab tersembunyi, imej hiasan lazy + prioriti rendah, dan `content-visibility` pada seksyen berat — kekal ringan walaupun dengan tema & kesan baharu.

## Teknologi

| Lapisan | Pilihan |
| --- | --- |
| Kerangka | Next.js 15 (App Router), React 19 |
| Bahasa | TypeScript, JavaScript, HTML, CSS |
| Gaya | Tailwind CSS 4 + token CSS tersuai (Material 3) |
| Data | PokéAPI (GraphQL v1beta2, sandaran REST v2) |

## Jalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Untuk binaan produksi: `npm run build && npm start`.

## Deploy ke Vercel

### Cara dashboard (paling pantas)
1. Buka [vercel.com/new](https://vercel.com/new) dan pilih repo **PokeMondo**.
2. Vercel mengesan Next.js secara automatik — tiada tetapan diperlukan (`vercel.json` sudah disertakan).
3. Klik **Deploy**. Setiap push kemudian ke `main` akan auto-deploy.

### Cara CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Jika domain produksi berbeza daripada `https://pokemondo.vercel.app`, set env variable
`NEXT_PUBLIC_SITE_URL` pada tetapan projek Vercel supaya metadata Open Graph memakai URL yang betul.

## Kredit

- Data: [PokéAPI](https://pokeapi.co)
- Ilham animasi: [React Bits](https://reactbits.dev)
- Sistem reka bentuk: [Material 3 / Material You](https://m3.material.io)
- Panduan pembersihan reka bentuk: unslop, vibe-skill, vibe-coding-skill, vibe-coder

Pokémon dan nama watak adalah tanda dagangan Nintendo / Game Freak / Creatures Inc. Projek ini tidak rasmi.
