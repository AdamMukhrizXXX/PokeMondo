"use client";

import { GEN_RANGES, genOf, type BasicPokemon } from "./pokemon";

export type AiProvider = "mistral" | "gemini" | "openai" | "openrouter";

export const PROVIDERS: Record<
  AiProvider,
  { label: string; model: string; keyHint: string; keyUrl: string }
> = {
  mistral: {
    label: "Mistral AI",
    model: "mistral-small-latest",
    keyHint: "Kunci percuma di console.mistral.ai",
    keyUrl: "https://console.mistral.ai",
  },
  gemini: {
    label: "Google Gemini",
    model: "gemini-2.0-flash",
    keyHint: "Kunci percuma di aistudio.google.com",
    keyUrl: "https://aistudio.google.com/app/apikey",
  },
  openai: {
    label: "OpenAI",
    model: "gpt-4o-mini",
    keyHint: "Kunci sk-… di platform.openai.com",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  openrouter: {
    label: "OpenRouter",
    model: "meta-llama/llama-3.3-70b-instruct:free",
    keyHint: "Kunci di openrouter.ai (ada model percuma)",
    keyUrl: "https://openrouter.ai/keys",
  },
};

const K_KEY = "md-ai-key";
const K_PROVIDER = "md-ai-provider";
const K_MODEL = "md-ai-model";

function get(key: string) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function put(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const getAiKey = () => get(K_KEY);
export const setAiKey = (v: string) => put(K_KEY, v.trim());
export const getAiProvider = (): AiProvider => {
  const p = get(K_PROVIDER) as AiProvider;
  return p in PROVIDERS ? p : "mistral";
};
export const setAiProvider = (p: AiProvider) => put(K_PROVIDER, p);
export const getAiModel = () => get(K_MODEL) || PROVIDERS[getAiProvider()].model;
export const setAiModel = (m: string) => put(K_MODEL, m.trim());

export const SYSTEM_PROMPT =
  "Anda ialah pembantu AI PokeMondo, laman Pokédex tidak rasmi. Jawab dalam Bahasa Melayu " +
  "yang ringkas dan padat, gunakan pengetahuan Pokémon anda, dan rujuk statistik dataset " +
  "yang diberikan bila relevan. Jangan mengarut fakta; jika tidak pasti, katakan begitu.";

export function datasetSummary(list: BasicPokemon[]): string {
  const total = list.length || 1025;
  const typeCount = new Map<string, number>();
  const genCount = new Map<string, number>();
  let dual = 0;
  const pairs = new Map<string, number>();
  for (const p of list) {
    if (!p.types) continue;
    genCount.set(genOf(p.id), (genCount.get(genOf(p.id)) ?? 0) + 1);
    for (const t of p.types) typeCount.set(t, (typeCount.get(t) ?? 0) + 1);
    if (p.types.length >= 2) {
      dual += 1;
      const key = [...p.types].sort().join("/");
      pairs.set(key, (pairs.get(key) ?? 0) + 1);
    }
  }
  const topTypes = [...typeCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topPairs = [...pairs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const gens = GEN_RANGES.map(([, , label]) => `${label}: ${genCount.get(label) ?? 0}`).join(", ");
  return [
    `STATISTIK POKÉDEX (set data laman, ${total} Pokémon):`,
    `Kiraan per generasi — ${gens}.`,
    `Jenis paling banyak — ${topTypes.map(([t, n]) => `${t} ${n}`).join(", ")}.`,
    `Gabungan dwi-jenis paling biasa — ${topPairs.map(([p, n]) => `${p} ${n}`).join(", ") || "tiada"}.`,
    `Pokémon dwi-jenis: ${dual} daripada ${total}.`,
  ].join("\n");
}

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function askAi(messages: ChatMsg[], context: string): Promise<string> {
  const provider = getAiProvider();
  const key = getAiKey();
  if (!key) throw new Error("NO_KEY");
  const model = getAiModel();
  const sys = SYSTEM_PROMPT + (context ? `\n\n${context}` : "");

  if (provider === "gemini") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        }),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: { text?: string }) => p.text ?? "")
      .join("");
    if (!text) throw new Error("Jawapan kosong daripada Gemini.");
    return text;
  }

  const base =
    provider === "mistral"
      ? "https://api.mistral.ai/v1"
      : provider === "openai"
        ? "https://api.openai.com/v1"
        : "https://openrouter.ai/api/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      ...(provider === "openrouter" ? { "X-Title": "PokeMondo" } : {}),
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: sys }, ...messages],
      temperature: 0.4,
      max_tokens: 900,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Jawapan kosong daripada model.");
  return text;
}
