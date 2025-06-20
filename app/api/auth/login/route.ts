// Generated by me but i got help from GPT4o
// Imports Axios and NextResponse for handling HTTP requests and responses
// Sets the env variable for accountsrv
// Sets up an HTTPS agent to handle self-signed certificates in development
// Function to handle POST requests for user login
// Using Axios to post login credentials and extract the token toand from  the accountsrv
// Then sets a cookie with the token in the response headers
// Error handling for login failures, returning status and error messages

import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL!;
const agent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const apiRes = await axios.post(
      `${AUTH_BASE}/api/Auth/login`,
      { email, password },
      {
        httpsAgent: agent,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    const { token } = apiRes.data;

    const res = NextResponse.json({ token });

 
    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      for (const hdr of setCookie) {
        res.headers.append("set-cookie", hdr);
      }
    }

    return res;
  } catch (err: any) {
    const status  = err.response?.status || 500;
    const message = err.response?.data?.message || "Login failed";
    return NextResponse.json({ error: message }, { status });
  }
}
