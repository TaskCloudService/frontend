// I have learned from the login route and applied it to this file.

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const EVENT_BASE    = process.env.NEXT_PUBLIC_EVENT_URL!;   
const BOOKING_BASE  = process.env.NEXT_PUBLIC_API_BOOKINGS_URL!; 
const agent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    
    const [evRes, bkRes] = await Promise.all([
      axios.get(`${EVENT_BASE}/api/events/${id}`,    { httpsAgent: agent }),
      axios.get(`${BOOKING_BASE}/api/bookings/count`, {
        httpsAgent: agent,
        params: { eventId: id },
      }),
    ]);

    const { capacity } = evRes.data;
    const { total }    = bkRes.data;          
    const ticketsLeft  = capacity - total;
    const percentSold  = capacity === 0 ? 0 : (total / capacity) * 100;

    return NextResponse.json({
      capacity,
      ticketsSold: total,
      ticketsLeft,
      percentSold,
    });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const msg    = err.response?.data?.message ?? "Stats fetch failed";
    return NextResponse.json({ error: msg }, { status });
  }
}
