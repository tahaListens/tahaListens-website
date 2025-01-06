import { getBlueskyClient } from "@/lib/bluesky-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { handle } = await request.json();
    if (!handle || !handle.includes(".") || handle.split(".").length < 2) {
      return NextResponse.json(
        { error: "Invalid handle format. Must be domain-like (e.g., username.example.com)." },
        { status: 400 }
      );
    }
    const client = await getBlueskyClient();
    const state = crypto.randomUUID();
    const url = await client.authorize(handle, { state });
    return NextResponse.json({ url });
  }

