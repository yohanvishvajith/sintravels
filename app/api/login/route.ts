import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const username = form.get("username")?.toString() ?? "";
    const password = form.get("password")?.toString() ?? "";

    if (!username || !password)
      return new Response(JSON.stringify({ ok: false, error: "Missing" }), {
        status: 400,
      });

    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
    });
    if (!user)
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid credentials" }),
        { status: 401 }
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid credentials" }),
        { status: 401 }
      );

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImg: user.profilePhoto || undefined,
    });

    // Set token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Return user info (without password)
    const { password: _p, ...safeUser } = user as any;
    return new Response(JSON.stringify({ ok: true, user: safeUser, token }), {
      status: 200,
    });
  } catch (err) {
    console.error("Login error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
