import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    // orderBy postedAt caused an error because schema doesn't have postedAt
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return new Response(JSON.stringify({ ok: true, jobs }), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch jobs", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
