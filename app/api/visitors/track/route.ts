import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Track a visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer } = body;

    // Get IP address and user agent from headers
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create visitor record
    await prisma.visitor.create({
      data: {
        ipAddress,
        userAgent,
        page: page || "/",
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}
