# PokeMondo

Pokédex web penuh — semua 1,025 Pokémon dari sembilan generasi terus dari [PokéAPI](https://pokeapi.co), dibina dengan Next.js 15, React 19, TypeScript, dan Tailwind CSS 4.

## Ciri

- **Hero Section** — headline blur-reveal, latar aurora tonal, kaunter animasi, dan bar carian yang menapis Pokédex secara langsung.
- **Pokédex penuh** — 1,025 spesies dimuat sekali melalui GraphQL PokéAPI (dengan sandaran REST), carian nama/nombor, penapis jenis dan generasi, susunan menaik/menurun.
- **Scroll Scrub Gallery** — bahagian melekat yang dipacu skrol: tatal untuk menyusuri sembilan generasi secara mendatar dengan penunjuk kemajuan.
- **Bottom Navigation** — bar navigasi gaya Material 3 dengan scroll-spy dan penunjuk kemajuan skrol di atas skrin, plus butang FAB "Rawak".
- **Modal Butiran** — statistik penuh, genus, flavor text, kebolehan, dan navigasi sebelum/seterusnya untuk mana-mana Pokémon.
- **Sistem Suara Pokémon** — suara seruan (cry) untuk semua 1,025 Pokémon dari PokéAPI cries, dimainkan melalui Web Audio API dengan satu AudioContext kongsi, cache AudioBuffer, fade halus, butang main pada setiap kad, penderak animasi dalam modal (autoplay), dan butang mute global yang diingati.
- **Pemain Muzik OST** — 177 runtutan muzik latar dari siri permainan Pokémon (Red/Blue hingga Legends Z-A) distrim sebagai latar belakang: main/jeda, lagu sebelum/seterusnya, **auto-tukar lagu** apabila tamat, putar rawak, cuba-semula, kelantangan, Media Session (kawalan skrin kunci), dan bunyi diredam (duck) seketika bila seruan Pokémon dimainkan. Kredit muzik: Nintendo / Game Freak / The Pokémon Company.
- **Tema Material You** — sistem token M3 (surface tonal, container, outline), mod cerah/gelap dengan kekal pilihan pengguna, ripple pada butang, sudut besar, dan warna dinamik mengikut jenis Pokémon.

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
