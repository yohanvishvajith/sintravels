import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({ take: 5 });
    return new Response(JSON.stringify({ ok: true, users }), { status: 200 });
  } catch (err) {
    console.error("DB test error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
    });
  }
}
