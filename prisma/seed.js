const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");

const prisma = new PrismaClient();

const DES_KEY = CryptoJS.enc.Utf8.parse(process.env.DES_KEY || "12345678");
const IV = CryptoJS.enc.Utf8.parse(process.env.DES_IV || "abcdefgh");

function encryptDES(text) {
  try {
    const encrypted = CryptoJS.DES.encrypt(text, DES_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return encrypted;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error encrypting text"
    );
  }
}

function decryptDES(text) {
  try {
    const decrypted = CryptoJS.DES.decrypt(text, DES_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error(error);
    return "";
  }
}

async function createAdmin() {
  console.log("🔐 Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
    name: process.env.ADMIN_NAME || "Administrator",
  };

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
    await prisma.admin.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
        name: defaultAdmin.name,
      },
    });

    console.log("✅ Admin seeded successfully!");
  } else {
    console.log("⚠️  Admin already exists. Skipping seeding.");
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

  console.log("📚 Seeding subjects...");

  await prisma.subject.deleteMany();
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

async function seedStudents() {
  console.log("👥 Seeding students...");

  const admin = await prisma.admin.findFirst();
  if (!admin) {
    throw new Error("Admin not found. Please seed admin first.");
  }

  const students = [
    {
      name: "Ahmad Fauzi",
      nisn: "0051234567",
      birthPlace: "Jakarta",
      birthDate: "2010-01-15",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Merdeka No. 10, Jakarta Pusat",
    },
    {
      name: "Siti Nurhaliza",
      nisn: "0051234568",
      birthPlace: "Bandung",
      birthDate: "2010-03-22",
      gender: "perempuan",
      religion: "Islam",
      grade: "6",
      address: "Jl. Sudirman No. 25, Bandung",
    },
    {
      name: "Budi Santoso",
      nisn: "0051234569",
      birthPlace: "Surabaya",
      birthDate: "2010-05-10",
      gender: "laki-laki",
      religion: "Kristen",
      grade: "6",
      address: "Jl. Pemuda No. 8, Surabaya",
    },
    {
      name: "Dewi Sartika",
      nisn: "0051234570",
      birthPlace: "Yogyakarta",
      birthDate: "2010-07-18",
      gender: "perempuan",
      religion: "Islam",
      grade: "6",
      address: "Jl. Malioboro No. 15, Yogyakarta",
    },
    {
      name: "Reza Pratama",
      nisn: "0051234571",
      birthPlace: "Medan",
      birthDate: "2010-09-03",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Gatot Subroto No. 20, Medan",
    },
    {
      name: "Rina Melati",
      nisn: "0051234572",
      birthPlace: "Semarang",
      birthDate: "2010-11-12",
      gender: "perempuan",
      religion: "Katolik",
      grade: "6",
      address: "Jl. Diponegoro No. 30, Semarang",
    },
    {
      name: "Andi Wijaya",
      nisn: "0051234573",
      birthPlace: "Makassar",
      birthDate: "2010-02-28",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Ahmad Yani No. 12, Makassar",
    },
    {
      name: "Maya Sari",
      nisn: "0051234574",
      birthPlace: "Palembang",
      birthDate: "2010-04-14",
      gender: "perempuan",
      religion: "Buddha",
      grade: "6",
      address: "Jl. Sudirman No. 18, Palembang",
    },
    {
      name: "Hendra Gunawan",
      nisn: "0051234575",
      birthPlace: "Banjarmasin",
      birthDate: "2010-06-25",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Lambung Mangkurat No. 5, Banjarmasin",
    },
    {
      name: "Indira Putri",
      nisn: "0051234576",
      birthPlace: "Denpasar",
      birthDate: "2010-08-07",
      gender: "perempuan",
      religion: "Hindu",
      grade: "6",
      address: "Jl. Gajah Mada No. 22, Denpasar",
    },
    {
      name: "Fajar Ramadhan",
      nisn: "0051234577",
      birthPlace: "Batam",
      birthDate: "2010-10-19",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Hang Tuah No. 17, Batam",
    },
    {
      name: "Lestari Wulandari",
      nisn: "0051234578",
      birthPlace: "Pontianak",
      birthDate: "2010-12-31",
      gender: "perempuan",
      religion: "Kristen",
      grade: "6",
      address: "Jl. Tanjungpura No. 9, Pontianak",
    },
    {
      name: "Rizky Firmansyah",
      nisn: "0051234579",
      birthPlace: "Pekanbaru",
      birthDate: "2010-01-08",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Jenderal Sudirman No. 14, Pekanbaru",
    },
    {
      name: "Nurul Aisyah",
      nisn: "0051234580",
      birthPlace: "Jambi",
      birthDate: "2010-03-16",
      gender: "perempuan",
      religion: "Islam",
      grade: "6",
      address: "Jl. Prof. Dr. Sumantri Brojonegoro No. 11, Jambi",
    },
    {
      name: "Dimas Prasetyo",
      nisn: "0051234581",
      birthPlace: "Padang",
      birthDate: "2010-05-27",
      gender: "laki-laki",
      religion: "Islam",
      grade: "6",
      address: "Jl. Prof. M. Yamin No. 16, Padang",
    },
  ];

  await prisma.student.deleteMany();

  for (const student of students) {
    await prisma.student.create({
      data: {
        name: encryptDES(student.name),
        nisn: encryptDES(student.nisn),
        birthPlace: encryptDES(student.birthPlace),
        birthDate: encryptDES(student.birthDate),
        gender: encryptDES(student.gender),
        religion: encryptDES(student.religion),
        grade: encryptDES(student.grade),
        address: encryptDES(student.address),
        adminId: admin.id,
      },
    });
  }

  console.log(`✅ Created ${students.length} students`);
}

async function seedScores() {
  console.log("📊 Seeding scores...");

  const students = await prisma.student.findMany();
  const subjects = await prisma.subject.findMany();

  if (students.length === 0 || subjects.length === 0) {
    throw new Error("Students or subjects not found. Please seed them first.");
  }

  await prisma.score.deleteMany();

  const semesters = ["1", "2"];
  const academicYear = "2024/2025";

  const generateRandomScore = () => {
    const scores = [75, 80, 85, 90, 95, 78, 82, 88, 92, 77, 83, 87, 91, 79, 84];
    return scores[Math.floor(Math.random() * scores.length)];
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "E";
  };

  let totalScores = 0;

  for (const student of students) {
    for (const semester of semesters) {
      for (const subject of subjects) {
        const scoreValue = generateRandomScore();
        const letterGrade = getLetterGrade(scoreValue);

        await prisma.score.create({
          data: {
            studentId: student.id,
            subjectId: subject.id,
            semester: encryptDES(semester),
            academicYear: encryptDES(academicYear),
            value: encryptDES(scoreValue.toString()),
            letterGrade: encryptDES(letterGrade),
          },
        });

        totalScores++;
      }
    }
  }

  console.log(`✅ Created ${totalScores} scores`);
}

async function main() {
  try {
    console.log("🚀 Starting database seeding...");

    await createAdmin();
    await seedSubjects();
    await seedStudents();
    await seedScores();

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("💥 Fatal error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
