import { NextRequest, NextResponse } from 'next/server';

function bffUrl(): string {
  return (process.env.BFF_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

async function proxy(request: NextRequest): Promise<NextResponse> {
  const upstream = await fetch(`${bffUrl()}/api/calculator/value`, {
    method: request.method,
    headers: { 'content-type': 'application/json' },
    body: request.method === 'PUT' ? await request.text() : undefined,
    signal: AbortSignal.timeout(5000),
  });
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxy(request);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return proxy(request);
}
