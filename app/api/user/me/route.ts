import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/jwt";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to get user" },
      { status: 500 }
    );
  }
}
