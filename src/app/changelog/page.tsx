import type { Metadata } from "next";
import ChangelogSection from "../../components/ChangelogSection";

export const metadata: Metadata = {
  title: "Changelog — PokeMondo",
  description:
    "Sejarah versi PokeMondo — ciri baharu, pembaikan, dan perubahan penting setiap kemas kini.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="min-h-svh pb-28 pt-16 sm:pt-20">
      <ChangelogSection />
    </div>
  );
}
