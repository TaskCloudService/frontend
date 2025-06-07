// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const EVENTS_BASE = process.env.NEXT_PUBLIC_EVENTS_URL!;
const agent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await axios.get(
      `${EVENTS_BASE}/api/Events/${params.id}`,
      { httpsAgent: agent, withCredentials: true }
    );
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || "Event not found" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get("authorization") ?? "";
  const payload = await req.json();
  try {
    const res = await axios.put(
      `${EVENTS_BASE}/api/Events/${params.id}`,
      payload,
      {
        httpsAgent: agent,
        withCredentials: true,
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(null, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to update event" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = _req.headers.get("authorization") ?? "";
  try {
    const res = await axios.delete(
      `${EVENTS_BASE}/api/Events/${params.id}`,
      {
        httpsAgent: agent,
        withCredentials: true,
        headers: { Authorization: auth },
      }
    );
    return NextResponse.json(null, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to delete event" },
      { status: err.response?.status || 500 }
    );
  }
}
