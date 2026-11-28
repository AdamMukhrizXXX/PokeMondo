"use client";

import { GEN_RANGES, genOf, type BasicPokemon } from "./pokemon";

export type AiProvider = "openrouter" | "groq" | "xkiro";

export const PROVIDERS: Record<
  AiProvider,
  { label: string; model: string; keyHint: string; keyUrl: string }
> = {
  openrouter: {
    label: "OpenRouter",
    model: "baidu/ernie-5.5-flash-preview:free",
    keyHint: "Kunci di openrouter.ai (ada model percuma)",
    keyUrl: "https://openrouter.ai/keys",
  },
  groq: {
    label: "Groq",
    model: "openai/gpt-oss-120b",
    keyHint: "Kunci percuma di console.groq.com",
    keyUrl: "https://console.groq.com/keys",
  },
  xkiro: {
    label: "xKiro",
    model: "qwen/qwen3.8-max:free",
    keyHint: "Kunci percuma di xkiro.com (ada 38+ model percuma)",
    keyUrl: "https://xkiro.com/dashboard",
  },
};

const BASES: Record<AiProvider, string> = {
  openrouter: "https://openrouter.ai/api/v1",
  groq: "https://api.groq.com/openai/v1",
  xkiro: "https://api.xkiro.com/v1",
};

const K_PROVIDER = "md-ai-provider";
const K_KEY_LEGACY = "md-ai-key";
const K_MODEL_LEGACY = "md-ai-model";

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

export const getAiProvider = (): AiProvider => {
  const p = get(K_PROVIDER) as AiProvider;
  return p in PROVIDERS ? p : "openrouter";
};
export const setAiProvider = (p: AiProvider) => put(K_PROVIDER, p);

export const getAiKey = (p: AiProvider = getAiProvider()): string => {
  const stored = get(`md-ai-key-${p}`);
  if (stored) return stored;
  return p === "openrouter" ? get(K_KEY_LEGACY) : "";
};
export const setAiKey = (p: AiProvider, v: string) => put(`md-ai-key-${p}`, v.trim());

export const getAiModel = (p: AiProvider = getAiProvider()): string => {
  const stored = get(`md-ai-model-${p}`) || (p === "openrouter" ? get(K_MODEL_LEGACY) : "");
  return stored || PROVIDERS[p].model;
};
export const setAiModel = (p: AiProvider, m: string) => put(`md-ai-model-${p}`, m.trim());

export const SYSTEM_PROMPT =
  "Anda ialah pembantu AI PokeX, laman Pok\u00e9dex tidak rasmi PokeMondo. Jawab dalam Bahasa Melayu " +
  "yang ringkas dan padat, gunakan pengetahuan Pok\u00e9mon anda, dan rujuk statistik dataset " +
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
    `STATISTIK POK\u00c9DEX (set data laman, ${total} Pok\u00e9mon):`,
    `Kiraan per generasi \u2014 ${gens}.`,
    `Jenis paling banyak \u2014 ${topTypes.map(([t, n]) => `${t} ${n}`).join(", ")}.`,
    `Gabungan dwi-jenis paling biasa \u2014 ${topPairs.map(([p, n]) => `${p} ${n}`).join(", ") || "tiada"}.`,
    `Pok\u00e9mon dwi-jenis: ${dual} daripada ${total}.`,
  ].join("\n");
}

type ChatMsg = { role: "user" | "assistant"; content: string };

function httpHint(status: number): string {
  if (status === 401 || status === 403) return "kunci API tidak sah / tidak aktif";
  if (status === 402) return "kredit atau had model percuma habis";
  if (status === 404) return "model tidak dijumpai \u2014 semak nama model dalam Tetapan";
  if (status === 408) return "pelayan terlalu lama menjawab";
  if (status === 429) return "had kadar (rate limit) \u2014 tunggu sebentar dan cuba lagi";
  if (status >= 500) return "masalah pelayan penyedia";
  return "ralat HTTP";
}

export const PRO_THINK_SECONDS = 50;

async function callChat(
  p: AiProvider,
  key: string,
  model: string,
  sys: string,
  messages: ChatMsg[],
  pro: boolean,
  onDelta?: (chunk: string) => void,
  onReason?: (chunk: string) => void,
): Promise<{ text: string; reasoning: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), pro ? 120000 : 60000);
  try {
    const res = await fetch(`${BASES[p]}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        ...(p === "openrouter" ? { "X-Title": "PokeMondo" } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: sys }, ...messages],
        temperature: 0.4,
        max_tokens: 900,
        stream: true,
        ...(pro && p === "openrouter" ? { reasoning: { effort: "high" } } : {}),
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} (${httpHint(res.status)})`);

    const contentType = res.headers.get("content-type") ?? "";
    if (!res.body || contentType.includes("application/json")) {
      const data = await res.json();
      const text = String(data?.choices?.[0]?.message?.content ?? "");
      if (!text) throw new Error("jawapan kosong daripada model");
      const reasoning = String(data?.choices?.[0]?.message?.reasoning ?? "");
      onDelta?.(text);
      if (reasoning) onReason?.(reasoning);
      return { text, reasoning };
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    let reasoning = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const s = line.trim();
        if (!s.startsWith("data:")) continue;
        const payload = s.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload) as {
            choices?: { delta?: { content?: string; reasoning?: string } }[];
          };
          const delta = json.choices?.[0]?.delta;
          const r = String(delta?.reasoning ?? "");
          const c = String(delta?.content ?? "");
          if (r) {
            reasoning += r;
            onReason?.(r);
          }
          if (c) {
            text += c;
            onDelta?.(c);
          }
        } catch {
          /* baris separa */
        }
      }
    }
    if (!text) throw new Error("jawapan kosong daripada model");
    return { text, reasoning };
  } finally {
    clearTimeout(timer);
  }
}

export async function askAi(
  messages: ChatMsg[],
  context: string,
  opts: {
    pro?: boolean;
    onDelta?: (chunk: string) => void;
    onReason?: (chunk: string) => void;
  } = {},
): Promise<{ text: string; via: AiProvider; reasoning?: string }> {
  const sys = SYSTEM_PROMPT + (context ? `\n\n${context}` : "");
  const preferred = getAiProvider();
  const order: AiProvider[] = [
    preferred,
    ...(["openrouter", "groq", "xkiro"] as AiProvider[]).filter((p) => p !== preferred),
  ];
  const errors: string[] = [];
  let sawKey = false;

  for (const p of order) {
    const key = getAiKey(p);
    if (!key) continue;
    sawKey = true;
    try {
      const { text, reasoning } = await callChat(
        p,
        key,
        getAiModel(p),
        sys,
        messages,
        !!opts.pro,
        opts.onDelta,
        opts.onReason,
      );
      return { text, via: p, reasoning: reasoning || undefined };
    } catch (e) {
      const msg =
        (e as Error).name === "AbortError"
          ? `tamat masa ${opts.pro ? 120 : 60} detik`
          : (e as Error).message;
      errors.push(`${PROVIDERS[p].label}: ${msg}`);
    }
  }

  if (!sawKey) throw new Error("NO_KEY");
  throw new Error(errors.join(" \u2022 "));
}
