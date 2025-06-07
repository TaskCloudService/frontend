// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const EVENTS_BASE = process.env.NEXT_PUBLIC_EVENTS_URL!;
const agent = process.env.NODE_ENV === "development"
  ? new https.Agent({ rejectUnauthorized: false })
  : undefined;

export async function GET() {
  try {
    const res = await axios.get(
      `${EVENTS_BASE}/api/Events/categories`,
      {
        httpsAgent: agent,
        withCredentials: true,
      }
    );
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || "Failed to load categories" },
      { status: err.response?.status || 500 }
    );
  }
}
