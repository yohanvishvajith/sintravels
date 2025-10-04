import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // tolerate empty currency sent by some clients: normalize to a sensible default
    if (body && (body.currency === "" || body.currency === null)) {
      body.currency = "Qatar riyal";
    }
    console.log("[api/admin/jobs] incoming body:", JSON.stringify(body));
    // Basic validation for essential fields only. Other fields are optional and will be defaulted.
    const required = [
      "title",
      "company",
      "salaryMin",
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
    const salaryMax =
      body.salaryMax === null ||
      body.salaryMax === undefined ||
      body.salaryMax === ""
        ? null
        : parseInt(body.salaryMax, 10);
    const ageMin = body.ageMin ? parseInt(body.ageMin, 10) : 0;
    const ageMax = body.ageMax ? parseInt(body.ageMax, 10) : 0;

    // normalize holidays to one of the allowed string options
    const HOLIDAY_OPTIONS = ["saturday", "sunday", "weekends"];
    const normalizeHoliday = (v: any) => {
      if (v === undefined || v === null || String(v).trim() === "")
        return "sunday";
      const s = String(v).toLowerCase();
      return HOLIDAY_OPTIONS.includes(s) ? s : "sunday";
    };

    if (Number.isNaN(salaryMin)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "salaryMin must be a number",
        }),
        { status: 400 }
      );
    }
    if (salaryMax !== null && Number.isNaN(salaryMax)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "salaryMax must be a number or empty",
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
    // legacy `benefits` JSON column removed from DB; ignore any provided body.benefits

    const createData: any = {
      title: String(body.title),
      company: String(body.company),
      location: body.location ? String(body.location) : "",
      country: body.country ? String(body.country) : "",
      flag: body.flag ? String(body.flag) : null,
      salaryMin,
      salaryMax,
      ageMin,
      ageMax,
      holidays: normalizeHoliday(body.holidays),
      currency: String(body.currency),
      type: String(body.type),
      industry: body.industry ? String(body.industry) : null,
      experience: body.experience ? String(body.experience) : null,
      benefitsAddc: body.benefitsAddc ? String(body.benefitsAddc) : null,
      visaCategory: body.visaCategory ? String(body.visaCategory) : null,
      contractPeriod: body.contractPeriod ? String(body.contractPeriod) : null,
      description: String(body.description),
      requirements: requirements as any,
      vacancies: body.vacancies ? parseInt(body.vacancies, 10) : 1,
      closingDate: new Date(body.closingDate),
    };

    let job;
    try {
      job = await prisma.job.create({ data: createData as any });
    } catch (err: any) {
      const msg = String(err?.message || err);
      // If Prisma client hasn't been regenerated it may reject unknown fields like `vacancies`.
      if (
        msg.includes("Unknown argument `vacancies`") ||
        msg.includes("Unknown arg `vacancies`") ||
        msg.includes("Unknown argument 'vacancies'")
      ) {
        // retry without vacancies
        const { vacancies, ...rest } = createData;
        job = await prisma.job.create({ data: rest as any });
      } else {
        throw err;
      }
    }
    console.log("[api/admin/jobs] created job id:", job.id);

    // persist selected benefit relations if provided (array of benefit ids)
    try {
      const benefitIds = Array.isArray(body.selectedBenefits)
        ? body.selectedBenefits.map((v: any) => Number(v))
        : [];
      if (benefitIds.length) {
        for (const bid of benefitIds) {
          await (prisma as any).jobBenefit.create({
            data: { jobId: job.id, benefitId: bid },
          });
        }
      }
    } catch (e) {
      console.error("Failed to create job benefit relations", e);
    }

    return new Response(JSON.stringify({ ok: true, job }), { status: 201 });
  } catch (err) {
    console.error("Failed to create job", err);
    // expose the error message in the response so client can surface the cause while debugging
    const message =
      err && (err as any).message ? (err as any).message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, error: "id is required" }),
        { status: 400 }
      );
    }

    // build update data only from provided fields
    const data: any = {};
    const allowed = [
      "title",
      "company",
      "location",
      "country",
      "flag",
      "holidays",
      "salaryMin",
      "salaryMax",
      "ageMin",
      "ageMax",
      "currency",
      "type",
      "industry",
      "experience",
      "benefitsAddc",
      "visaCategory",
      "contractPeriod",
      "description",
      "requirements",
      "vacancies",
      "closingDate",
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        // normalize holidays if provided
        if (key === "holidays") {
          const HOLIDAY_OPTIONS = ["saturday", "sunday", "weekends"];
          if (body.holidays === null || body.holidays === "") {
            data.holidays = "sunday";
          } else {
            const hv = String(body.holidays).toLowerCase();
            data.holidays = HOLIDAY_OPTIONS.includes(hv) ? hv : "sunday";
          }
          continue;
        }
        if (key === "requirements" || key === "benefits") {
          // normalize arrays
          if (Array.isArray(body[key])) data[key] = body[key];
          else if (typeof body[key] === "string")
            data[key] = body[key]
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
          else data[key] = [];
        } else if (
          key === "salaryMin" ||
          key === "salaryMax" ||
          key === "ageMin" ||
          key === "ageMax" ||
          key === "vacancies"
        ) {
          // Parse numeric fields. Allow 0 as a valid value for update.
          // If the client explicitly sent null, store null (for nullable fields like salaryMax).
          const raw = body[key];

          // If raw is explicitly null and the field is salaryMax, set to null
          if (key === "salaryMax" && raw === null) {
            data[key] = null;
            continue;
          }

          // If undefined or empty string, skip (no change)
          if (raw === undefined || String(raw).trim() === "") {
            continue;
          }

          const parsed = parseInt(raw, 10);
          if (Number.isNaN(parsed)) {
            // invalid number, skip it
            continue;
          }
          // include parsed numeric value (0 is valid)
          data[key] = parsed;
        } else if (key === "closingDate") {
          data[key] = body[key] ? new Date(body[key]) : null;
        } else {
          data[key] = body[key];
        }
      }
    }

    const jobId = String(id);
    console.log(
      "[api/admin/jobs PUT] update data payload:",
      JSON.stringify(data, null, 2)
    );
    const job = await prisma.job.update({ where: { id: jobId }, data });

    // update benefit relations if provided
    if (body.selectedBenefits !== undefined) {
      try {
        // delete existing relations
        await (prisma as any).jobBenefit.deleteMany({
          where: { jobId: jobId },
        });
        const benefitIds = Array.isArray(body.selectedBenefits)
          ? body.selectedBenefits.map((v: any) => Number(v))
          : [];
        for (const bid of benefitIds) {
          await (prisma as any).jobBenefit.create({
            data: { jobId: jobId, benefitId: bid },
          });
        }
      } catch (e) {
        console.error("Failed to update job benefit relations", e);
      }
    }
    return new Response(JSON.stringify({ ok: true, job }), { status: 200 });
  } catch (err) {
    console.error("Failed to update job", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    // accept id in body (json) or query param
    let id: any = null;
    try {
      const body = await req.json();
      id = body?.id;
    } catch (e) {
      // ignore parse error
    }
    if (!id) {
      // try url search params
      const url = new URL(req.url);
      id = url.searchParams.get("id");
    }
    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, error: "id is required" }),
        { status: 400 }
      );
    }

    const jobId = String(id);
    await prisma.job.delete({ where: { id: jobId } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to delete job", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
