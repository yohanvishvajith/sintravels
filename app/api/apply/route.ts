import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Expect jobId and userId from the client. Resume is optional.
    const jobId = formData.get("jobId")?.toString() ?? "";
    const userIdRaw = formData.get("userId")?.toString() ?? "";
    const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;
    const coverNote = formData.get("coverNote")?.toString() ?? "";

    const file = formData.get("resume") as File | null;
    let resumePath: string | null = null;
    if (file) {
      // Ensure uploads folder
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
      resumePath = `/uploads/${filename}`;
    }

    // Prevent duplicate application by same user for same job
    if (userId) {
      const existing = await prisma.applicant.findFirst({
        where: { userId: userId, jobId },
      });
      if (existing) {
        // If the same user has already applied, return success so the client
        // doesn't show an error to the user. The application already exists.
        return new Response(
          JSON.stringify({ ok: true, note: "already_applied" }),
          { status: 200 }
        );
      }
    }

    // Create applicant record linking to job and optional user
    const applicant = await prisma.applicant.create({
      data: {
        userId: userId || null,
        coverNote: coverNote || null,
        resumePath: resumePath,
        jobId,
      },
    });

    return new Response(JSON.stringify({ ok: true, applicant }), {
      status: 201,
    });
  } catch (err) {
    console.error("Upload error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
