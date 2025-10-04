import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const countries = await (prisma as any).country.findMany({
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify({ ok: true, countries }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to fetch countries", err);
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
    const country = await (prisma as any).country.create({
      data: { name: String(body.name) },
    });
    return new Response(JSON.stringify({ ok: true, country }), { status: 201 });
  } catch (err) {
    console.error("Failed to create country", err);
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
    const country = await (prisma as any).country.update({
      where: { id: Number(body.id) },
      data: { name: String(body.name || "") },
    });
    return new Response(JSON.stringify({ ok: true, country }), { status: 200 });
  } catch (err) {
    console.error("Failed to update country", err);
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
    await (prisma as any).country.delete({ where: { id: Number(body.id) } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to delete country", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
