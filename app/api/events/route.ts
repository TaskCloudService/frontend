// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import https from "https";

const EVENTS_BASE = process.env.NEXT_PUBLIC_EVENTS_URL!;
const agent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;


export async function GET(req: Request) {
  const auth  = req.headers.get("authorization") ?? "";
  const url   = new URL(req.url);
  const query = url.searchParams.toString();
  const api   = `${EVENTS_BASE}/api/Events${query ? `?${query}` : ""}`;

  const res = await fetch(api, {
    headers: { Authorization: auth },
    credentials: "include",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

function maybeJson(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json") ? res.json() : res.text();
}

/* POST handler */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const form = await req.formData();

  const res = await fetch(`${EVENTS_BASE}/api/Events`, {
    method: "POST",
    headers: { Authorization: auth },
    body: form,
    credentials: "include",
  });

  const data = await maybeJson(res);       
  return NextResponse.json(
    res.ok ? data : { error: data },
    { status: res.status },
  );
}
