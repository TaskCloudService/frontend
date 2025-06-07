// I have learned from the login route and applied it to this file.

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";


const BOOKINGS_BASE = process.env.NEXT_PUBLIC_API_BOOKINGS_URL!;  


const agent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;


export async function POST(req: NextRequest) {
  const body = await req.json();
  const auth = req.headers.get("authorization") ?? "";
  const cookie = req.headers.get("cookie") ?? "";

  try {
    const apiRes = await axios.post(
      `${BOOKINGS_BASE}/api/bookings`,
      body,
      {
        httpsAgent: agent,
        withCredentials: true,
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
          Cookie: cookie,            
        },
      }
    );


    const res = NextResponse.json(apiRes.data, { status: apiRes.status });

    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      for (const hdr of setCookie) res.headers.append("set-cookie", hdr);
    }

    return res;
  } catch (err: any) {
    const status  = err.response?.status || 500;
    const message = err.response?.data?.message ?? "Booking API error";
    return NextResponse.json({ error: message }, { status });
  }
}
