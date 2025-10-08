import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const form = await req.formData();
    const id = form.get("id")?.toString();
    if (!id)
      return new Response(JSON.stringify({ ok: false, error: "Missing id" }), {
        status: 400,
      });

    const updates: any = {};
    const username = form.get("username")?.toString();
    const address = form.get("address")?.toString();
    if (username) updates.username = username;
    if (address) updates.address = address;

    const file = form.get("profilePhoto") as File | null;
    if (file) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      const filename = `${Date.now()}_${file.name.replace(
        /[^a-zA-Z0-9.\-_]/g,
        "_"
      )}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, uint8);
      updates.profilePhoto = `/uploads/${filename}`;
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updates,
    });
    const { password: _p, ...safeUser } = user as any;
    return new Response(JSON.stringify({ ok: true, user: safeUser }), {
      status: 200,
    });
  } catch (err) {
    console.error("User update error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
