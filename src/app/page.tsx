import { fetchPokedexPrefetch } from "../lib/pokemon-server";
import type { BasicPokemon } from "../lib/pokemon";
import Home from "../components/Home";

export const dynamic = "force-static";

export default async function Page() {
  let initial: BasicPokemon[] = [];
  try {
    initial = await fetchPokedexPrefetch(AbortSignal.timeout(15000));
  } catch {
    initial = [];
  }
  return <Home initialList={initial} />;
}
