import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const industries = await (prisma as any).industry.findMany({
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify({ ok: true, industries }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to fetch industries", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name)
      return new Response(
        JSON.stringify({ ok: false, error: "name is required" }),
        { status: 400 }
      );
    const industry = await (prisma as any).industry.create({
      data: { name: String(body.name) },
    });
    return new Response(JSON.stringify({ ok: true, industry }), {
      status: 201,
    });
  } catch (err) {
    console.error("Failed to create industry", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id)
      return new Response(
        JSON.stringify({ ok: false, error: "id is required" }),
        { status: 400 }
      );
    const industry = await (prisma as any).industry.update({
      where: { id: Number(body.id) },
      data: { name: String(body.name || "") },
    });
    return new Response(JSON.stringify({ ok: true, industry }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to update industry", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id)
      return new Response(
        JSON.stringify({ ok: false, error: "id is required" }),
        { status: 400 }
      );
    await (prisma as any).industry.delete({ where: { id: Number(body.id) } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to delete industry", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
