import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

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

    // For now, return user object (no session) — integrate next-auth or real sessions later
    const { password: _p, ...safeUser } = user as any;
    return new Response(JSON.stringify({ ok: true, user: safeUser }), {
      status: 200,
    });
  } catch (err) {
    console.error("Login error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
