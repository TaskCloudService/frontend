// I have learned from the login route and applied it to this file.

export const runtime = 'nodejs';

import axios from 'axios'
import https from 'https'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('NEXT_PUBLIC_AUTH_URL =', process.env.NEXT_PUBLIC_AUTH_URL)
  try {
    const { email } = await req.json()

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/Auth/send-code`,
      { email },
      {
       
        httpsAgent:
          process.env.NODE_ENV === 'development'
            ? new https.Agent({ rejectUnauthorized: false })
            : undefined,
        headers: { 'Content-Type': 'application/json' },
        timeout: 10_000, 
      }
    )

    return NextResponse.json(res.data, { status: res.status })
  } catch (err: any) {
    console.error('Send-code failed:', err)
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        backendError: err.response?.data,
      },
      { status: err.response?.status || 500 }
    )
  }
}
