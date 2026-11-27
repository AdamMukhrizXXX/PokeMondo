import type { Metadata, Viewport } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { fetchPokedexPrefetch } from "../lib/pokemon-server";
import type { BasicPokemon } from "../lib/pokemon";
import { PokedexProvider } from "../lib/pokedex-context";
import SiteShell from "../components/SiteShell";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
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

const themeInit = `(function(){try{var s=localStorage.getItem("md-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light";var t=localStorage.getItem("md-site-theme");if(t)document.documentElement.dataset.siteTheme=t;if(!localStorage.getItem("md-session"))document.documentElement.dataset.gate="1";}catch(e){document.documentElement.dataset.theme="light";}})();`;

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
      <body className={`${fredoka.variable} ${jakarta.variable}`}>
        <PokedexProvider initialList={initialList}>
          <SiteShell>{children}</SiteShell>
        </PokedexProvider>
      </body>
    </html>
  );
}
