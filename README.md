# PokeMondo

Pokédex web penuh — semua 1,025 Pokémon dari sembilan generasi terus dari [PokéAPI](https://pokeapi.co), dibina dengan Next.js 15, React 19, TypeScript, dan Tailwind CSS 4.

## Ciri

- **Hero Section** — headline blur-reveal, latar aurora tonal, kaunter animasi, dan bar carian yang menapis Pokédex secara langsung.
- **Pokédex penuh** — 1,025 spesies dimuat sekali melalui GraphQL PokéAPI (dengan sandaran REST), carian nama/nombor, penapis jenis dan generasi, susunan menaik/menurun.
- **Scroll Scrub Gallery** — bahagian melekat yang dipacu skrol: tatal untuk menyusuri sembilan generasi secara mendatar dengan penunjuk kemajuan.
- **Bottom Navigation** — bar navigasi gaya Material 3 dengan scroll-spy dan penunjuk kemajuan skrol di atas skrin, plus butang FAB "Rawak".
- **Modal Butiran** — statistik penuh, genus, flavor text, kebolehan, dan navigasi sebelum/seterusnya untuk mana-mana Pokémon.
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

## Kredit

- Data: [PokéAPI](https://pokeapi.co)
- Ilham animasi: [React Bits](https://reactbits.dev)
- Sistem reka bentuk: [Material 3 / Material You](https://m3.material.io)
- Panduan pembersihan reka bentuk: unslop, vibe-skill, vibe-coding-skill, vibe-coder

Pokémon dan nama watak adalah tanda dagangan Nintendo / Game Freak / Creatures Inc. Projek ini tidak rasmi.
