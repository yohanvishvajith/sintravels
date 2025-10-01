const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function upsertJob(job) {
  const existing = await prisma.job.findFirst({
    where: { title: job.title, company: job.company },
  });

  if (existing) {
    await prisma.job.update({
      where: { id: existing.id },
      data: job,
    });
    return existing;
  } else {
    return await prisma.job.create({ data: job });
  }
}

async function main() {
  const sampleJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Solutions",
      location: "Singapore",
      country: "Singapore",
      flag: "🇸🇬",
      salaryMin: 80000,
      salaryMax: 120000,
      ageMin: 25,
      ageMax: 45,
      currency: "SGD",
      type: "Full-time",
      industry: "Technology",
      experience: "Senior",
      description:
        "Join our innovative team to build cutting-edge software solutions...",
      requirements: [
        "5+ years React/Node.js",
        "AWS experience",
        "Team leadership",
      ],
      benefits: [
        "Health, dental, and vision insurance",
        "401(k) matching",
        "Flexible work hours",
        "Professional development budget",
      ],
      applicants: 12,
      closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
    {
      title: "Marketing Manager",
      company: "Global Marketing Inc",
      location: "Remote",
      country: "Global",
      flag: "🌍",
      salaryMin: 70000,
      salaryMax: 90000,
      ageMin: 23,
      ageMax: 40,
      currency: "USD",
      type: "Full-time",
      industry: "Marketing",
      experience: "Mid-level",
      description: "Lead marketing campaigns for international markets...",
      requirements: [
        "Digital marketing experience",
        "Campaign management",
        "Analytics",
      ],
      benefits: ["Health insurance", "Paid time off", "Remote-first culture"],
      applicants: 5,
      closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
    },
  ];

  for (const job of sampleJobs) {
    await upsertJob(job);
  }

  console.log("Seeded jobs (with benefits)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
