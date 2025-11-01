import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch visitor statistics
export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total visitors
    const total = await prisma.visitor.count();

    // Get today's visitors
    const today = await prisma.visitor.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    });

    // Get this week's visitors
    const thisWeek = await prisma.visitor.count({
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

    // Get this month's visitors
    const thisMonth = await prisma.visitor.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    });

    const visitorStats = {
      total,
      today,
      thisWeek,
      thisMonth,
    };

    return NextResponse.json(visitorStats);
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor statistics" },
      { status: 500 }
    );
  }
}
