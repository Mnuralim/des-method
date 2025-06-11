const { encryptDES } = require('./des');
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  console.log("Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME || "Admin",
  };

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(defaultAdmin.password, 10);

    await prisma.admin.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
        name: defaultAdmin.name,
      },
    });

    console.log("✅ Admin seeded successfully!");
  } else {
    console.log("ℹ️ Admin already exists. Skipping seeding.");
  }
}

async function seedSubjects() {
  const subjects = [
    { name: "Matematika", code: "MAT001" },
    { name: "Bahasa Indonesia", code: "BIN001" },
    { name: "Bahasa Inggris", code: "BIG001" },
    { name: "IPA (Ilmu Pengetahuan Alam)", code: "IPA001" },
    { name: "IPS (Ilmu Pengetahuan Sosial)", code: "IPS001" },
    { name: "Pendidikan Agama Islam", code: "PAI001" },
    { name: "Pendidikan Kewarganegaraan", code: "PKN001" },
    { name: "Seni Budaya dan Prakarya", code: "SBP001" },
    { name: "Pendidikan Jasmani Olahraga dan Kesehatan", code: "PJK001" },
    { name: "Muatan Lokal", code: "MLK001" },
  ];

  console.log("🌱 Seeding subjects...");

  for (const subject of subjects) {
    await prisma.subject.create({
      data: {
        name: encryptDES(subject.name),
        code: encryptDES(subject.code),
      },
    });
  }

  console.log(`✅ Created ${subjects.length} subjects`);
}

async function main() {
  await createAdmin();
  await seedSubjects();
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
