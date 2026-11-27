import type { Metadata, Viewport } from "next";
import { Baloo_2, Caveat, DM_Sans } from "next/font/google";
import "./globals.css";
import { fetchPokedexPrefetch } from "../lib/pokemon-server";
import type { BasicPokemon } from "../lib/pokemon";
import { PokedexProvider } from "../lib/pokedex-context";
import SiteShell from "../components/SiteShell";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["500", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pokemondo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PokeMondo — Pokédex untuk Semua",
  description:
    "Jelajahi 1025 Pokémon dari sembilan generasi. Carian pantas, penapis jenis senyap, dan galeri scrub dahulu — semua data dari PokéAPI.",
  keywords: ["pokemon", "pokédex", "pokeapi", "next.js", "material you"],
  openGraph: {
    title: "PokeMondo — Pokédex untuk Semua",
    description:
      "Semua 1025 Pokémon, sembilan generasi, hero section dengan scroll scrub dan tema Material You.",
    url: siteUrl,
    siteName: "PokeMondo",
    locale: "ms_MY",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PokeMondo — Pokédex untuk Semua",
    description: "1025 Pokémon, 9 generasi, satu Pokédex yang cantik.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0e0b" },
  ],
};

const themeInit = `(function(){try{var s=localStorage.getItem("md-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light";var t=localStorage.getItem("md-site-theme");if(t)document.documentElement.dataset.siteTheme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialList: BasicPokemon[] = [];
  try {
    initialList = await fetchPokedexPrefetch(AbortSignal.timeout(15000));
  } catch {
    initialList = [];
  }
  return (
    <html lang="ms" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${baloo.variable} ${dmSans.variable} ${caveat.variable}`}>
        <PokedexProvider initialList={initialList}>
          <SiteShell>{children}</SiteShell>
        </PokedexProvider>
      </body>
    </html>
  );
}
