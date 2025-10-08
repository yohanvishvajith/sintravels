import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const username = form.get("username")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    // phone field removed from user model
    const password = form.get("password")?.toString() ?? "";
    const retype = form.get("retypePassword")?.toString() ?? "";
    const address = form.get("address")?.toString() ?? "";

    if (!username || !email || !password || !retype) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing fields" }),
        { status: 400 }
      );
    }
    if (password !== retype) {
      return new Response(
        JSON.stringify({ ok: false, error: "Passwords do not match" }),
        { status: 400 }
      );
    }

    // profile photo optional
    const file = form.get("profilePhoto") as File | null;
    let profilePath: string | null = null;
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
      profilePath = `/uploads/${filename}`;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        // phone removed
        profilePhoto: profilePath,
        address: address || null,
      },
    });

    // remove password before returning
    const { password: _p, ...safeUser } = user as any;
    return new Response(JSON.stringify({ ok: true, user: safeUser }), {
      status: 201,
    });
  } catch (err) {
    console.error("Register error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
