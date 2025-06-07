// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import https from "https";

const TERMS_URL = process.env.NEXT_PUBLIC_CONTENT_URL!; 
const httpsAgent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

function handleError(ctx: string, err: AxiosError) {
  if (!err.response) {
    console.error(`[${ctx}] upstream unreachable`, err.code, err.message);
    return NextResponse.json(
      { error: "Upstream unreachable", detail: `${err.code}: ${err.message}` },
      { status: 502 }
    );
  }
  console.error(`[${ctx}] upstream ${err.response.status}`, err.response.data);
  return NextResponse.json(
    { error: "Upstream error", detail: err.response.data },
    { status: err.response.status }
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ location: string }> }
) {
  const { location } = await params;
  const auth = req.headers.get("authorization") ?? "";

  try {
    const res = await axios.get(
      `${TERMS_URL}/api/terms/${encodeURIComponent(location)}`,
      { httpsAgent, withCredentials: true, headers: { Authorization: auth } }
    );
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return handleError("GET /terms", e as AxiosError);
  }
}
