import type { Metadata } from "next";
import ApiKeyStudio from "../../components/ApiKeyStudio";

export const metadata: Metadata = {
  title: "Kunci API PokeAPI — PokeMondo",
  description:
    "Jana kunci API peribadi untuk aplikasi anda yang dibina atas data PokéAPI — dijana dalam pelayar, tanpa pelayan.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="min-h-svh px-5 pb-28 pt-16 sm:px-8 sm:pt-20 lg:px-16">
      <ApiKeyStudio />
    </div>
  );
}
