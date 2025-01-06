export async function GET(request: NextRequest) {
    const client = await getBlueskyClient();
    const params = request.nextUrl.searchParams;
    const result = await client.callback(params);
    
    if (!result?.session) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 400 }
      );
    }
  
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "bluesky_session",
      value: JSON.stringify(result.session),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/"
    });
  
    return response;
  }