import type { Metadata } from "next";
import MusicResourceCenter from "../../components/MusicResourceCenter";

export const metadata: Metadata = {
  title: "Download Resource Muzik — PokeMondo",
  description:
    "Muat turun lagu OST Pokémon satu persatu ke pelayar anda — muzik hanya boleh diputar selepas sumbernya dimuat turun.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="min-h-svh px-5 pb-28 pt-16 sm:px-8 sm:pt-20 lg:px-16">
      <MusicResourceCenter />
    </div>
  );
}
