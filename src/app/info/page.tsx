import type { Metadata } from "next";
import InfoSection from "../../components/InfoSection";

export const metadata: Metadata = {
  title: "Info — PokeMondo",
  description: "Tentang PokeMondo, data terbuka PokéAPI, dan kredit reka bentuk.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="min-h-svh pb-28 pt-16 sm:pt-20">
      <InfoSection />
    </div>
  );
}
