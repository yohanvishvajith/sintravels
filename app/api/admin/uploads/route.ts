import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as any;
    if (!file) {
      return new Response(
        JSON.stringify({ ok: false, error: "file is required" }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "flags");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${(file.name || "flag").replace(
      /[^a-zA-Z0-9._-]/g,
      ""
    )}`;
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, uint8);

    const url = `/uploads/flags/${safeName}`;
    return new Response(JSON.stringify({ ok: true, url }), { status: 201 });
  } catch (err) {
    console.error("Upload failed", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
