import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const form = await req.formData();
    const id = form.get("id")?.toString();
    const current = form.get("currentPassword")?.toString() || "";
    const nextPass = form.get("newPassword")?.toString() || "";
    const retype = form.get("retypeNewPassword")?.toString() || "";

    if (!id)
      return new Response(JSON.stringify({ ok: false, error: "Missing id" }), {
        status: 400,
      });
    if (!current || !nextPass || !retype)
      return new Response(
        JSON.stringify({ ok: false, error: "Missing fields" }),
        { status: 400 }
      );
    if (nextPass !== retype)
      return new Response(
        JSON.stringify({ ok: false, error: "Passwords do not match" }),
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return new Response(
        JSON.stringify({ ok: false, error: "User not found" }),
        { status: 404 }
      );

    // Ensure user has a password set
    if (!user.password)
      return new Response(
        JSON.stringify({ ok: false, error: "No password set" }),
        { status: 400 }
      );

    const match = await bcrypt.compare(current, user.password);
    if (!match)
      return new Response(
        JSON.stringify({ ok: false, error: "Current password is incorrect" }),
        { status: 401 }
      );

    const hashed = await bcrypt.hash(nextPass, 10);
    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashed },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Change password error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
