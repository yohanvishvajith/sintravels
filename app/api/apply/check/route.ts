import prisma from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const userIdRaw = url.searchParams.get("userId");
    const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;

    if (!jobId || !userId) {
      return new Response(JSON.stringify({ applied: false }), { status: 200 });
    }

    const existing = await prisma.applicant.findFirst({
      where: { jobId, userId },
    });
    return new Response(JSON.stringify({ applied: !!existing }), {
      status: 200,
    });
  } catch (err) {
    console.error("check apply error", err);
    return new Response(JSON.stringify({ applied: false }), { status: 500 });
  }
}
