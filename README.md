# PokeMondo

Pokédex web penuh — semua 1,025 Pokémon dari sembilan generasi terus dari [PokéAPI](https://pokeapi.co), dibina dengan Next.js 15, React 19, TypeScript, dan Tailwind CSS 4.

## Ciri

- **Gerbang Akaun & Boot Shimmer** — log masuk/daftar (emel + kata laluan, min 6 aksara) wajib sebelum masuk laman, dengan **pengesahan OTP 6 digit dua langkah**: kod rawak (crypto.getRandomValues) dihoskan dalam "peti mel simulasi" (laman statik tiada pelayan emel) dengan butang salin, kotak OTP beranimasi (pop berperingkat, fokus terangkat, auto-langkau & tampal, goyang saat salah, pop hijau bertingkat saat berjaya + auto-sahkan), **percubaan & hantar semula tanpa had**, kod tamat tempoh 5 minit dengan kiraan detik langsung (teks berkilau Shiny Text); UI OTP penuh live animation — tajuk gradien bergerak, kotak digit bercahaya denyut bila diisi, fokus terangkat 3D bersinar, peti mel berhalo denyut, aurora mini hanyut dalam kad peti mel, dan butang Sahkan berbingkai bintang berputar (Star Border); akaun disimpan hanya dalam pelayar (kata laluan dihash SHA-256 melalui SubtleCrypto, garam rawak, tanpa pelayan; pendaftaran hanya ditulis selepas OTP lulus); sesi diingati merentas muat semula, baris **Log Keluar** dalam Tetapan sidebar. Selepas log masuk, **Boot Screen skeleton shimmer 40 saat** memuatkan keseluruhan Pokédex (frasa fasa berkilau, kiraan Pokémon sedia secara langsung, bar kemajuan + kiraan detik, 8 kad skeleton berkilau; reduced-motion dihormati) — hanya sekali setiap pelayar.
- **Latar Live Motion 3D** — latar belakang web utama kini hidup: dua lapisan aurora besar bergerak & berputar perlahan, tiga orbs 3D realistik (sorotan kilau, bayang dalam, warna mengikut tema cerah/gelap) melayang dengan lintasan sendiri, dan parallax tetikus berhalus — orbs bergerak mengikut kedalaman (adaptasi reactbits Aurora, CSS keyframes tulen, hormat reduced-motion, auto-mati semasa Mod GPU Lite & latar custom aktif, berjeda bila tab tersembunyi).
- **Hero Section** — headline "Seribu Wajah. Satu ___" dengan **teks 3D bergerak** (extrude shadow + float 3D + parallax tilt mengikut tetikus) dan **kata hidup (live text)** yang bertukar sendiri — Legenda / Cerita / Petualangan / Misteri / Keajaiban; latar aurora tonal, kaunter animasi, dan bar carian yang menapis Pokédex secara langsung.
- **Pokédex penuh** — 1,025 spesies dimuat sekali melalui GraphQL PokéAPI (dengan sandaran REST), carian nama/nombor, penapis jenis dan generasi, susunan menaik/menurun.
- **Galeri Scroll Velocity** — dua baris teks berhalaju ikut kelajuan skrol + sembilan kad generasi (snap, paralaks artwork) menuju bahagian Pokédex.
- **Halaman berasingan** — Rumah (dengan **Scroll Scrub galeri generasi** terus di halaman utama), Kuiz, Pokédex, Info, **Muzik**, dan **Kunci API** kini laman App Router berasingan (`/`, `/kuiz`, `/pokedex`, `/info`, `/muzik`, `/api-key`) dengan metadata tersendiri; carian Hero terus mula menapis di `/pokedex?q=…`, dan kad Terokai menghubungkan setiap halaman.
- **Pustaka Muzik (halaman `/muzik`)** — senarai muzik yang menyatukan **semua OST Pokémon (177 trek)** dan **muzik import anda** dalam satu senarai: tab Semua/OST/Import dengan kiraan, carian tajuk/permainan serta-merta, trek semasa ditanda & butang main terus melalui Pemain Muzik yang sama, badge "Import" untuk lagu sendiri, dan buang import terus dari senarai; import fail audio (≤25MB, disimpan IndexedDB) boleh dibuat dari sini atau Tetapan — main senarai penuh + import tanpa berpindah halaman.
- **Sistem Multi-lingual** — pemilih **Bahasa** dalam Tetapan & Kawalan dengan **93 bahasa** merangkumi bahasa setiap negara (termasuk bahasa serantau Indonesia: Jawa Baku, **Jawa Pantura/Utara**, **Jawa Timur/Wetan**, Sunda, Madura, Bugis, Minangkabau, Aceh, Bali) — carian bahasa secara langsung, nama asli + bendera, terjemahan penuh untuk 20 bahasa utama (Melayu, English, Indonesia, Jawa ×3, Sunda, 中文, 日本語， 한국어, हिन्दी, العربية, Español, Français, Português, Deutsch, Русский, ไทย, Tiếng Việt, Filipino), bahasa lain sandar ke English, sokongan **RTL** penuh (Arab, Parsi, Urdu, Ibrani, Pashto), `<html lang/dir>` dikemas kini secara langsung, dan pilihan disimpan dalam localStorage (`md-lang`) tanpa kilat semasa muat.
- **Penjana Kunci API PokeAPI (halaman `/api-key`)** — Sistem Generate API Key With PokeAPI 💯: jana kunci API peribadi format `pkm_live_…` (32 aksara heks daripada `crypto.getRandomValues`), beri label, salin automatik ke papan klip, senarai kunci tersimpan dengan topeng (`pkm_live_xxxx…xxxx`), dan tarik balik bila-bila masa — semua disimpan hanya dalam localStorage pelayar (tiada pelayan), lengkap dengan kad rujukan base URL PokéAPI dan contoh `fetch` dengan pengepala `X-Api-Key`.
- **Staggered Menu** (reactbits.dev) — menu sidebar sebenar tanpa GSAP untuk navigasi halaman: dua prelayer M3 meluncur bertingkat, panel kaca `clamp(260px, 38vw, 420px)`, item navigasi besar uppercase dengan stagger label + penomboran, teks toggle `Menu↔Close` bergilir dan ikon plus berputar menjadi X; item aktif mengikut laluan semasa (auto tutup semasa navigasi). Butang toggle di penjuru kiri atas — hanya **ikon Muzik** kekal di kanan atas.
- **Tetapan dalam Sidebar** — semua kawalan (Bunyi, Cerah/Gelap, Tema Laman, Latar Custom, SPUI) kini dalam seksyen **Tetapan & Kawalan** di dalam Staggered Menu: baris ikon + label dengan hover lembut; popover (Latar Custom, SPUI) kekal terbuka semasa sidebar terbuka. Ikon berwarna berkualiti tinggi: Latar Custom kini bingkai landskap gradien **hidup** (langit biru, matahari amber dengan 8 sinar berputar + denyut lembut, awan putih hanyut beransur, kilauan cahaya melintasi gunung hijau-teal, bingkai teal-biru) dan SPUI kini peranti mini-Pokédex **hidup** (badan gradien merah Poké Ball, skrin dengan garisan gunung teal + imbasan berkilau menyapu, lensa bulat putih dengan halo teal berdenyut + titik kilau, LED hijau berkelip); hover mempercepat semua animasi ikon (sinar, awan, imbasan, halo & LED) dan dot indikator aktif berdenyut; kedua-dua butang dengan hover scale + bayang. Ikon Bunyi & SFX pula pembesar suara gradien teal-biru dengan tiga gelombang berwarna (amber, hijau, jingga) yang "menari" berperingkat saat bunyi aktif (tanda X merah saat dimatikan), dan ikon Cerah/Gelap crossfade licin antara matahari gradien amber dengan sinar berputar + denyut dan bulan sabit biru dengan halo berdenyut + bintang berkelip; semua animasi CSS tulen + reduced-motion. Dok kaca bawah (Navbar Bottom) telah dibuang.
- **PokeX (halaman `/pokex`)** — AI analisis Pokémon kini halaman penuh yang kemas: kepala PokeX dengan ikon sparkle, tab Sembang/Tetapan, panel sembang besar (sehingga 42rem) dengan preset soalan, kad butiran, dan badge "Kunci aktif"; BYOK tiga penyedia — OpenRouter (model `baidu/ernie-5.5-flash-preview:free`), Groq (model `openai/gpt-oss-120b`) dan **xKiro** (model percuma `qwen/qwen3.8-max:free`, konteks 1M — gateway serasi OpenAI di `api.xkiro.com` dengan 38+ model percuma); kunci disimpan per penyedia hanya dalam pelayar, dan jika penyedia pilihan gagal (HTTP/had kadar) PokeX automatik mencuba penyedia lain mengikut giliran (nota "via" ditunjuk pada jawapan). Sistem Pokémon Rawak (dadu) telah dibuang.
- **SPUI Prestasi GPU & Auto-Detect Peranti** — panel SPUI kini memapar meter **FPS masa-nyata** (rAF, jeda bila tab tersembunyi), kad info peranti yang dikesan automatik dan berkemas kini masa-nyata (GPU melalui WebGL debug info, CPU teras, RAM, skrin @DPR, sentuhan, jenis rangkaian — semua sandaran selamat untuk semua peranti), serta **Mod GPU Auto**: jika FPS jatuh di bawah 40 selama 3 saat, kesan berat (kabur kaca, deco, animasi) dikurangkan automatik melalui `data-gpu-lite` dan kembali penuh bila FPS pulih.
- **PokeX Pro Thinking (khusus OpenRouter)** — togel Pro Thinking mengaktifkan fikir mendalam (`reasoning: { effort: "high" }`) pada OpenRouter (model `baidu/ernie-5.5-flash-preview:free`), sasaran 50 saat dengan bar kemajuan masa langsung (Ns/50s), penunjuk thinking khas, dan lipatan "Proses pemikiran Pro" pada jawapan; Groq dikecualikan (terlalu pantas membalas untuk thinking panjang). UI halaman PokeX dinaik taraf dengan adaptasi reactbits.dev tanpa dependensi: **GradientText** bergerak pada tajuk (teal→biru→amber) dan **SpotlightCard** (sorotan cahaya mengikut kursor) pada panel.
- **PokeX AI & API Masa-Nyata (streaming)** — jawapan dan proses pemikiran AI distrim secara langsung (SSE) dari OpenRouter & Groq semasa dijana: teks muncul bertubi-tubi dalam gelembung sembang dengan avatar X dan **caret berkelip**, proses reasoning dipapar redup seketika, dan **Uji API** memapar kiraan aksara langsung semasa menguji. Ikon X direka baharu gaya **tanda tangan profesional** — lengkung kaligrafi dengan flourish dan permata berlian berdenyut, dipakai pada kepala PokeX, avatar sembang, watermark, dan kad Terokai di Rumah.
- **Modal Butiran** — statistik penuh, genus, flavor text, kebolehan, dan navigasi sebelum/seterusnya untuk mana-mana Pokémon.
- **Sistem Suara Pokémon** — suara seruan (cry) untuk semua 1,025 Pokémon dari PokéAPI cries, dimainkan melalui Web Audio API dengan satu AudioContext kongsi, cache AudioBuffer, fade halus, butang main pada setiap kad, penderak animasi dalam modal (autoplay), dan butang mute global yang diingati.
- **Pemain Muzik OST** — 177 runtutan muzik latar dari siri permainan Pokémon (Red/Blue hingga Legends Z-A) distrim sebagai latar belakang: main/jeda, lagu sebelum/seterusnya, **auto-tukar lagu** apabila tamat, putar rawak, cuba-semula, kelantangan, Media Session (kawalan skrin kunci), dan bunyi diredam (duck) seketika bila seruan Pokémon dimainkan. **Import Muzik**: muat naik fail OST Pokémon anda sendiri (mp3/ogg/m4a/wav/flac, ≤ 25MB) dari peranti — disimpan kekal dalam pelayar (IndexedDB), boleh dimain/dipadam, dan terjana dalam auto-tukar serta putar rawak. Kredit muzik: Nintendo / Game Freak / The Pokémon Company.
- **SFX Butang** — palet penuh kesan bunyi sintesis Web Audio (tiada fail): klik, toggle hidup/mati, buka/tutup modal & pemain muzik, tick penomboran, arpeggi Rawak, jaya/gagal import, dan denyut hover halus — semua melalui delegasi global (termasuk papan kekunci Enter/Space), mengikut toggle Bunyi, dan boleh disenyapkan dengan `data-no-sfx`.
- **Jam Dunia (tengah-atas)** — jam masa nyata semua dunia: 9 rantau Pokémon + 85+ zon dunia (semua benua & negara utama) dengan carian negara/bandar, titik siang/malam, dan kemas kini setiap saat — tiada panggilan rangkaian. **Langit hidup**: matahari bergradien dengan dua lapisan sinar berputar berlawanan arah + denyut lembut + halo hangat melintasi arka 6:00–18:00, bulan sabit bergradien dengan halo berdenyut + kawah + **bintang jatuh** pada waktu malam, 6 bintang berkelip + awan hanyut, langit menukar gradien siang↔malam dengan lancar. **Cuaca masa nyata** (Open-Meteo, percuma tanpa kunci, lokasi pelayar + fallback Kuala Lumpur, cache 30 minit): chip ikon cuaca + suhu dalam kad langit dan kesan hidup — hujan (titisan jatuh), gerimis, salji (kekape jatuh perlahan), mendung/berawan (awan tambah + langit gelap), kabus (kabut hanyut), ribut petir (kilat berkelip). Prestasi: panel di-portal ke body (z-60, `data-portal-panel` — tidak lagi dilindungi Pemain Muzik / butang tidak hilang), blur pada butang tetap dibuang, masa senarai dikemas kini setiap 15 saat (jam utama tetap setiap saat), pemformat Intl dicache.
- **Latar Custom** — pengunjung boleh memuat naik gambar sendiri sebagai latar belakang web (maks 12MB), disimpan kekal dalam pelayar (IndexedDB), dengan kawalan keamatan dan kabur (blur); imej hiasan Pokémon lalai tersembunyi secara automatik apabila latar custom aktif.
- **Deteksi tamat muzik** — kiraan detik masa berbaki ditunjuk secara masa nyata (pill mini & pemain penuh), dan apabila lagu tamat sistem mengesan secara automatik serta menunj: "… tamat — auto tukar ke lagu seterusnya".
- **Server Terbuka** — pelayan Pokédex terbuka sentiasa untuk semua 1,025 Pokémon; sistem penutupan & kod redeem telah ditarik balik.
- **3 Tema Laman** — tukar wajah laman dari dok kawalan: **Neobrutalism** (sempadan tebal hitam, bayang keras beroffset, headline uppercase berbayang, tekstur kertas titik halftone, butang berkesan tekan angkat/masuk, scrollbar tegar; kabur kaca & kesan lembut dimatikan untuk prestasi), **Claymorphism** (permukaan lembut 'tanam' dengan dwi-bayang dalaman seperti tanah liat), dan **Glassmorphism** (kaca lut sinar, blur 20px, gradien blob biru/teal/pink) — diingati dalam pelayar dan serasi mod cerah/gelap; nilai lama (Hand-Drawn/Liquid Glass/Bauhaus) kembali ke tema Dasar secara automatik.
- **Kuiz Rawak Tanpa Had** — teka siluet Pokémon dengan 4 pilihan; soalan baharu terjana setiap kali daripada 1,025 spesies, skor + rentetan + rekod terbaik, SFX jaya/gagal.
- **Sistem SPUI** — jika UI utama bermasalah, setiap seksyen dilindungi Error Boundary: kad ralat dengan ikon amaran muncul di tempatnya lengkap butang "Cuba semula" dan "Guna SPUI". SPUI ialah versi ringkas stabil (carian, penapis jenis, halaman, sprite, modal butiran) tanpa animasi; boleh ditukar/balik melalui ikon amaran di penjuru atas kanan, pilihan diingati dalam pelayar, dan SPUI mempunyai butang **Keluar SPUI** untuk kembali ke UI penuh serta-merta.
- **AI Anal Pokémon** — analisis semua 1,025 Pokémon dengan **AI sebenar** (API model bahasa): bawa-kunci-anda-sendiri (BYOK) — pengunjung masukkan kunci API mereka sendiri (OpenRouter, Groq atau xKiro), disimpan hanya dalam pelayar; statistik dataset (jenis, generasi, dwi-jenis) dihantar sebagai konteks bersama setiap soalan, dengan butang analisis pantas + sembang penuh.
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

### Auto Deploy (GitHub Actions — terus ke produksi)

Setiap push ke `main` (atau jalankan manual melalui tab **Actions → Deploy Produksi (Vercel) → Run workflow**) akan deploy terus ke produksi **https://poke-mondo.vercel.app/** melalui GitHub Actions — tanpa menunggu Vercel Bot.

Sekali sahaja, sediakan:
1. Cipta token di [vercel.com/account/tokens](https://vercel.com/account/tokens) (scope: Full Account).
2. Dalam repo: **Settings → Secrets and variables → Actions → New repository secret**, nama `VERCEL_TOKEN`, nilai token tadi.

Workflow: `.github/workflows/deploy-vercel.yml`. Preview Vercel Bot pada PR boleh dimatikan di dashboard Vercel (projek **poke-mondo** → Settings → Git → matikan bot komen preview) supaya tiada langkah tambahan yang perlu ditunggu.

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
