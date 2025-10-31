import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all countries from the Country table
    const countriesFromDB = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        flagimg: true,
      },
    });

    // Get job counts by country from the database
    const jobStats = await prisma.job.groupBy({
      by: ["country"],
      where: {
        closingDate: {
          gte: new Date(), // Only count active jobs (not expired)
        },
      },
      _count: {
        id: true,
      },
    });

    // Create a map of country name to job count
    const jobCountMap = jobStats.reduce((acc: Record<string, number>, stat) => {
      acc[stat.country] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Combine country data with job counts
    const countryStatsWithFlags = countriesFromDB.map((country) => ({
      name: country.name,
      flagImg: country.flagimg || null,
      jobs: jobCountMap[country.name] || 0,
    }));

    return NextResponse.json(countryStatsWithFlags);
  } catch (error) {
    console.error("Error fetching country stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch country statistics" },
      { status: 500 }
    );
  }
}
