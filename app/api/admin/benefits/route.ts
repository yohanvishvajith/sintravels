import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const benefits = await (prisma as any).benefit.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify({ ok: true, benefits }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to fetch benefits", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name || String(name).trim() === "") {
      return new Response(
        JSON.stringify({ ok: false, error: "name is required" }),
        { status: 400 }
      );
    }
    const benefit = await (prisma as any).benefit.create({
      data: { name: String(name) },
    });
    return new Response(JSON.stringify({ ok: true, benefit }), { status: 201 });
  } catch (err) {
    console.error("Failed to create benefit", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name } = body;
    if (!id)
      return new Response(
        JSON.stringify({ ok: false, error: "id is required" }),
        { status: 400 }
      );
    const benefit = await (prisma as any).benefit.update({
      where: { id: Number(id) },
      data: { name: String(name) },
    });
    return new Response(JSON.stringify({ ok: true, benefit }), { status: 200 });
  } catch (err) {
    console.error("Failed to update benefit", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    let id: any = null;
    try {
      const body = await req.json();
      id = body?.id;
    } catch (e) {
      // ignore
    }
    if (!id) {
      const url = new URL(req.url);
      id = url.searchParams.get("id");
    }
    if (!id)
      return new Response(
        JSON.stringify({ ok: false, error: "id is required" }),
        { status: 400 }
      );
    await (prisma as any).benefit.delete({ where: { id: Number(id) } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to delete benefit", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
