import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the URL server-side
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CSP-Header-Checker/1.0)",
      },
      redirect: "follow",
    });

    // Extract CSP headers
    const cspHeaders: Record<string, string> = {};
    const cspHeaderNames = [
      "content-security-policy",
      "content-security-policy-report-only",
      "x-content-security-policy",
      "x-webkit-csp",
    ];

    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (cspHeaderNames.includes(lowerKey)) {
        cspHeaders[key] = value;
      }
    });

    // If no CSP headers found, return a message
    if (Object.keys(cspHeaders).length === 0) {
      return NextResponse.json({
        url: targetUrl.toString(),
        cspHeaders: {},
        message: "No CSP headers found",
        statusCode: response.status,
      });
    }

    return NextResponse.json({
      url: targetUrl.toString(),
      cspHeaders,
      statusCode: response.status,
    });
  } catch (error) {
    console.error("Error fetching CSP headers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch CSP headers",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
