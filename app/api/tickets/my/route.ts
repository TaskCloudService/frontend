// I have learned from the login route and applied it to this file.

import { NextRequest, NextResponse } from "next/server";

const BOOKING_BASE = process.env.NEXT_PUBLIC_API_BOOKINGS_URL!;

export async function GET(req: NextRequest) {
  // 1️⃣ Grab incoming bearer token
  let auth = req.headers.get("authorization") || "";
  if (!auth) {
    const cookieVal = req.cookies.get("sb-kkjlstbkkftinagesdtk-auth-token")?.value;
    if (cookieVal) {
      try {
        const payload = JSON.parse(Buffer.from(cookieVal.replace(/^base64-/, ""), "base64").toString());
        auth = `${payload.token_type ?? "Bearer"} ${payload.access_token}`;
      } catch {
        console.error("Failed to parse auth token from cookie");
      }
    }
  }

  if (!auth) {
    return NextResponse.json({ error: "No authorization token provided" }, { status: 401 });
  }

  console.log("Proxying GET /api/tickets/my to:", BOOKING_BASE);

  try {
    const upstream = await fetch(
      `${BOOKING_BASE}/api/Tickets/my`,
      { headers: { Authorization: auth } }
    );
    const data = await upstream.json();

    console.log("BookingSrv returned", Array.isArray(data) ? data.length : 0, "tickets");

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    console.error("Error proxying to BookingSrv:", err);
    return NextResponse.json({ error: err.message ?? "Something went wrong" }, { status: 500 });
  }
}
