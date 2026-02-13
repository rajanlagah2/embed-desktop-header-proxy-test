import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { jwtSecret, origins } = await request.json();

    if (!jwtSecret) {
      return NextResponse.json(
        { error: "JWT secret is required" },
        { status: 400 }
      );
    }

    if (!origins || origins.length === 0) {
      return NextResponse.json(
        { error: "At least one origin is required" },
        { status: 400 }
      );
    }

    // Join origins with space as shown in the example
    const allowedFrameAncestorsOrigin = origins.join(" ");

    // Sign the JWT token
    const signedToken = jwt.sign(
      {
        "allowed-frame-ancestors-origin": allowedFrameAncestorsOrigin,
      },
      jwtSecret
    );

    return NextResponse.json({
      token: signedToken,
      payload: {
        "allowed-frame-ancestors-origin": allowedFrameAncestorsOrigin,
      },
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      {
        error: "Failed to generate token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
