import type { Metadata } from "next";
import MusicLibrary from "../../components/MusicLibrary";

export const metadata: Metadata = {
  title: "Pustaka Muzik Pokémon — PokeMondo",
  description:
    "Senarai penuh 177 runtutan OST Pokémon dan fail import anda dalam satu pustaka — cari, main, dan urus muzik latar.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="min-h-svh px-5 pb-28 pt-16 sm:px-8 sm:pt-20 lg:px-16">
      <MusicLibrary />
    </div>
  );
}
