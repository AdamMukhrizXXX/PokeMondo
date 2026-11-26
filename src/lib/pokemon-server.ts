import type { BasicPokemon, PokemonType } from "./pokemon";

const BULK_QUERY = `
query Dex {
  pokemon(where: {id: {_lte: 1025}}, order_by: {id: asc}) {
    id
    name
    pokemontypes(order_by: {slot: asc}) {
      type { name }
    }
  }
}`;

export async function fetchPokedexPrefetch(
  signal: AbortSignal,
): Promise<BasicPokemon[]> {
  const res = await fetch("https://graphql.pokeapi.co/v1beta2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: BULK_QUERY }),
    signal,
  });
  if (!res.ok) throw new Error("graphql unavailable");
  const json = (await res.json()) as {
    data?: {
      pokemon: Array<{ id: number; name: string; pokemontypes: Array<{ type: { name: string } }> }>;
    };
  };
  if (!json.data) throw new Error("graphql unavailable");
  const rows: BasicPokemon[] = json.data.pokemon.map((row) => ({
    id: row.id,
    name: row.name,
    types: row.pokemontypes.map((t) => t.type.name as PokemonType),
  }));
  if (rows.length < 1025) throw new Error("graphql incomplete");
  return rows;
}
