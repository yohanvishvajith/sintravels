import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In the App Router context, `params` can be a promise-like value in some runtimes.
    // Await it before accessing properties to avoid the Next.js sync-dynamic-apis error.
    const p = await (params as any);
    const jobId = p?.id;

    if (!jobId) {
      return new Response(
        JSON.stringify({ ok: false, error: "Job ID is required" }),
        { status: 400 }
      );
    }

    // Fetch benefits associated with this job
    const jobBenefits = await (prisma as any).jobBenefit.findMany({
      where: { jobId: String(jobId) },
      include: {
        benefit: true,
      },
    });

    const benefits = jobBenefits.map((jb: any) => ({
      id: jb.benefit.id,
      name: jb.benefit.name,
    }));

    return new Response(JSON.stringify({ ok: true, benefits }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to fetch job benefits", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
