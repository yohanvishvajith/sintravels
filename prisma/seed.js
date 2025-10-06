const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Default credentials (change in production!)
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin";

  const hashed = await bcrypt.hash(defaultPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@local" },
    update: {
      username: "admin",
      password: hashed,
      phone: "+0000000000",
      profilePhoto: null,
      address: "Head Office",
      name: "Administrator",
      role: "ADMIN",
    },
    create: {
      email: "admin@local",
      username: "admin",
      password: hashed,
      phone: "+0000000000",
      profilePhoto: null,
      address: "Head Office",
      name: "Administrator",
      role: "ADMIN",
    },
  });

  // Don't print the password hash for safety, but show the credentials and user id
  console.log("Default admin user created/updated:");
  console.log({
    id: user.id,
    email: user.email,
    username: user.username,
    phone: user.phone,
    profilePhoto: user.profilePhoto,
    address: user.address,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  });
  console.log("\nUse these credentials to sign in (plain password):");
  console.log("username: admin");
  console.log('password: (the value of DEFAULT_ADMIN_PASSWORD env or "admin")');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
