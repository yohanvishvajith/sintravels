import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[api/admin/jobs] incoming body:", JSON.stringify(body));
    // Basic validation for essential fields only. Other fields are optional and will be defaulted.
    const required = [
      "title",
      "company",
      "salaryMin",
      "salaryMax",
      "currency",
      "type",
      "description",
      "closingDate",
    ];
    for (const key of required) {
      if (
        body[key] === undefined ||
        body[key] === null ||
        String(body[key]).trim() === ""
      ) {
        return new Response(
          JSON.stringify({ ok: false, error: `${key} is required` }),
          { status: 400 }
        );
      }
    }

    // parse numeric fields
    const salaryMin = parseInt(body.salaryMin, 10);
    const salaryMax = parseInt(body.salaryMax, 10);
    const ageMin = body.ageMin ? parseInt(body.ageMin, 10) : 0;
    const ageMax = body.ageMax ? parseInt(body.ageMax, 10) : 0;

    if (Number.isNaN(salaryMin) || Number.isNaN(salaryMax)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "salaryMin and salaryMax must be numbers",
        }),
        { status: 400 }
      );
    }

    // requirements and benefits should be arrays; accept comma-separated strings as well
    const normalizeArray = (v: any) => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string")
        return v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      return [];
    };

    const requirements = body.requirements
      ? normalizeArray(body.requirements)
      : [];
    const benefits = body.benefits ? normalizeArray(body.benefits) : [];

    const job = await prisma.job.create({
      data: {
        title: String(body.title),
        company: String(body.company),
        location: body.location ? String(body.location) : "",
        country: body.country ? String(body.country) : "",
        flag: body.flag ? String(body.flag) : null,
        salaryMin,
        salaryMax,
        ageMin,
        ageMax,
        currency: String(body.currency),
        type: String(body.type),
        industry: body.industry ? String(body.industry) : null,
        experience: body.experience ? String(body.experience) : null,
        description: String(body.description),
        requirements: requirements as any,
        benefits: benefits.length ? (benefits as any) : null,
        closingDate: new Date(body.closingDate),
      },
    });
    console.log("[api/admin/jobs] created job id:", job.id);

    return new Response(JSON.stringify({ ok: true, job }), { status: 201 });
  } catch (err) {
    console.error("Failed to create job", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
