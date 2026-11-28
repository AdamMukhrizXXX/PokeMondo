export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = "https://api.xkiro.com/v1";

async function forward(req: Request, method: "GET" | "POST") {
  const { pathname, search } = new URL(req.url);
  const sub = pathname.replace(/^\/api\/xkiro\/?/, "");
  const target = `${UPSTREAM}/${sub}${search}`;

  const headers: HeadersInit = {};
  const auth = req.headers.get("authorization");
  if (auth) (headers as Record<string, string>).Authorization = auth;
  const ct = req.headers.get("content-type");
  if (ct) (headers as Record<string, string>)["Content-Type"] = ct;

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      ...(method === "POST" ? { body: await req.text() } : {}),
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: { message: "xKiro upstream tidak dapat dihubungi" } },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  return forward(req, "GET");
}

export async function POST(req: Request) {
  return forward(req, "POST");
}
