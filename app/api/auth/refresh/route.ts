// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL!;
const agent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

export async function POST(req: Request) {

  const cookie = req.headers.get("cookie") ?? "";

  try {
    
    const apiRes = await axios.post(
      `${AUTH_BASE}/api/Auth/refresh-token`,
      null,
      {
        httpsAgent: agent,
        withCredentials: true,
        headers: { Cookie: cookie },
      }
    );

    const { token } = apiRes.data;
    const res = NextResponse.json({ token });

    
    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      for (const hdr of setCookie) res.headers.append("set-cookie", hdr);
    }

    return res;
  } catch (err: any) {
    const status  = err.response?.status || 401;
    const message = err.response?.data?.message || "Unable to refresh session";
    return NextResponse.json({ error: message }, { status });
  }
}
