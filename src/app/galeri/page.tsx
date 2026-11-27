import type { Metadata } from "next";
import ScrubGallery from "../../components/ScrubGallery";

export const metadata: Metadata = {
  title: "Galeri Generasi — PokeMondo",
  description: "Scrub melintasi sembilan generasi Pokémon dalam galeri berinertia.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="pb-28 pt-14 sm:pt-20">
      <ScrubGallery />
    </div>
  );
}
