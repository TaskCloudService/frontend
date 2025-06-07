// I have learned from the login route and applied it to this file.

import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import https from "https";


const PROFILE_URL = process.env.NEXT_PUBLIC_PROFILE_URL!;
const httpsAgent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;


function handleAxiosError(ctx: string, err: AxiosError) {
  if (!err.response) {
    console.error(`[${ctx}] upstream unreachable`, err.code, err.message);
    return NextResponse.json(
      { error: "Upstream unreachable", detail: `${err.code}: ${err.message}` },
      { status: 502 },
    );
  }


  const { status, data } = err.response;
  console.error(`[${ctx}] upstream ${status}`, JSON.stringify(data));
  return NextResponse.json(
    {
      detail: data,             
    },
    { status },
  );
}


export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  try {
    const res = await axios.get(`${PROFILE_URL}/api/Profile`, {
      httpsAgent,
      withCredentials: true,
      headers: { Authorization: auth },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return handleAxiosError("GET /profile", e as AxiosError);
  }
}


export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const payload = await req.json();
  try {
    const res = await axios.post(`${PROFILE_URL}/api/Profile`, payload, {
      httpsAgent,
      withCredentials: true,
      headers: { Authorization: auth, "Content-Type": "application/json" },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return handleAxiosError("POST /profile", e as AxiosError);
  }
}


export async function PUT(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const payload = await req.json();
  try {
    const res = await axios.put(`${PROFILE_URL}/api/Profile`, payload, {
      httpsAgent,
      withCredentials: true,
      headers: { Authorization: auth, "Content-Type": "application/json" },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return handleAxiosError("PUT /profile", e as AxiosError);
  }
}

export async function DELETE(req: Request) {
  const auth = req.headers.get("authorization") ?? "";

  try {
    const res = await axios.delete(
      `${PROFILE_URL}/api/Profile`,
      {
        httpsAgent,
        withCredentials: true,
        headers: { Authorization: auth },
      },
    );

       if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    /* any other status may include JSON */
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return handleAxiosError("DELETE /profile", e as AxiosError);
  }
}
