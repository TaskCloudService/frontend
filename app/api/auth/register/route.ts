// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/Auth/register`,
      { email, password, firstName, lastName },
      {
        httpsAgent:
          process.env.NODE_ENV === "development"
            ? new https.Agent({ rejectUnauthorized: false })
            : undefined,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Registration failed";
    return NextResponse.json({ error: message }, { status });
  }
}
