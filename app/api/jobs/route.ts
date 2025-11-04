import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    // Prefer typed Prisma query
    try {
      const jobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          jobBenefits: {
            include: { benefit: true },
          },
        },
      });

      // map benefits to a simple array of names derived from the normalized relation
      const out = jobs.map((j: any) => {
        const normalized = Array.isArray(j.jobBenefits)
          ? j.jobBenefits.map((jb: any) => jb.benefit?.name).filter(Boolean)
          : [];
        return {
          ...j,
          benefits: normalized,
          workTime: j.workTime ?? null,
        };
      });

      return new Response(JSON.stringify({ ok: true, jobs: out }), {
        status: 200,
      });
    } catch (err: any) {
      // If the error is due to a missing legacy `benefits` column (generated client out of date)
      const msg = String(err?.message || err || "").toLowerCase();
      if (
        msg.includes("sintravels.job.benefits") ||
        msg.includes("job.benefits")
      ) {
        console.warn(
          "Prisma client out-of-sync: falling back to raw SQL for /api/jobs",
          err
        );
        // Raw fallback: select explicit columns and merge job_benifits
        const rawJobs: any[] = await prisma.$queryRawUnsafe(`
          SELECT id, title, company, location, country, flag, salaryMin, salaryMax, vacancies, ageMin, ageMax, holidays, currency, type, workTime, industry, experience, description, requirements, closingDate, createdAt, updatedAt
          FROM Job
          ORDER BY createdAt DESC
          LIMIT 100
        `);

        const ids = rawJobs.map((r) => r.id).filter(Boolean);
        let jbRows: any[] = [];
        if (ids.length) {
          // Build an IN list safely for fallback (ids are cuid strings)
          const inList = ids
            .map((id) => `'${String(id).replace(/'/g, "''")}'`)
            .join(",");
          jbRows = await prisma.$queryRawUnsafe(`
            SELECT jb.jobId as jobId, b.name as name
            FROM job_benifits jb
            JOIN benifits b ON jb.benefitId = b.id
            WHERE jb.jobId IN (${inList})
          `);
        }

        const jbMap: Record<string, string[]> = {};
        for (const r of jbRows) {
          if (!jbMap[r.jobId]) jbMap[r.jobId] = [];
          if (r.name) jbMap[r.jobId].push(r.name);
        }

        const out = rawJobs.map((r: any) => ({
          ...r,
          benefits: jbMap[r.id] || [],
          workTime: r.workTime ?? null,
        }));

        return new Response(JSON.stringify({ ok: true, jobs: out }), {
          status: 200,
        });
      }

      throw err;
    }

    // response already returned from inner try/catch branches
  } catch (err) {
    console.error("Failed to fetch jobs", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
