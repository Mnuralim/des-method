"use server";

import { decryptDES, encryptDES } from "@/lib/des";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createActivity } from "./activity";

type FormState = {
  error: string | null;
};

export async function getAllScores(
  isDecrypted: boolean,
  limit: string,
  skip: string,
  student?: string,
  subject?: string,
  semester?: string,
  academicYear?: string,
  sortOrder?: string,
  grade?: string
) {
  let scores = await prisma.score.findMany({
    take: parseInt(limit),
    skip: parseInt(skip),
    include: {
      student: true,
      subject: true,
    },
    orderBy: {
      createdAt: sortOrder === "asc" ? "asc" : "desc",
    },
  });

  if (isDecrypted) {
    scores = scores.map((score) => ({
      ...score,
      semester: decryptDES(score.semester),
      academicYear: decryptDES(score.academicYear),
      value: decryptDES(score.value),
      letterGrade: decryptDES(score.letterGrade),
      student: {
        ...score.student,
        name: decryptDES(score.student.name),
        nisn: decryptDES(score.student.nisn),
        birthPlace: decryptDES(score.student.birthPlace),
        birthDate: decryptDES(score.student.birthDate),
        address: decryptDES(score.student.address),
        religion: decryptDES(score.student.religion),
        grade: decryptDES(score.student.grade),
        gender: decryptDES(score.student.gender),
      },
      subject: {
        ...score.subject,
        name: decryptDES(score.subject.name),
        code: decryptDES(score.subject.code),
      },
    }));
  }

  if (student) {
    scores = scores.filter((score) =>
      score.student.id.toLowerCase().includes(student.toLowerCase())
    );
  }

  if (subject) {
    scores = scores.filter((score) =>
      score.subject.id.toLowerCase().includes(subject.toLowerCase())
    );
  }

  if (semester) {
    scores = scores.filter(
      (score) => score.semester.toLowerCase() === semester.toLowerCase()
    );
  }

  if (academicYear) {
    scores = scores.filter(
      (score) => score.academicYear.toLowerCase() === academicYear.toLowerCase()
    );
  }

  if (grade) {
    scores = scores.filter(
      (score) => score.student.grade.toLowerCase() === grade.toLowerCase()
    );
  }

  return {
    scores,
    totalCount: scores.length,
    currentPage: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
    totalPages: Math.ceil(scores.length / parseInt(limit)),
    itemsPerPage: parseInt(limit),
  };
}

async function checkScoreExists(
  studentId: string,
  subjectId: string,
  semester: string,
  academicYear: string,
  excludeId?: string
): Promise<boolean> {
  const existingScores = await prisma.score.findMany({
    where: {
      studentId,
      subjectId,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });

  return existingScores.some((score) => {
    try {
      const decryptedSemester = decryptDES(score.semester);
      const decryptedAcademicYear = decryptDES(score.academicYear);

      return (
        decryptedSemester.toLowerCase() === semester.toLowerCase() &&
        decryptedAcademicYear.toLowerCase() === academicYear.toLowerCase()
      );
    } catch (error) {
      console.error("Failed to decrypt score data:", error);
      return false;
    }
  });
}

export async function createScore(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const studentId = formData.get("studentId") as string;
  const subjectId = formData.get("subjectId") as string;
  const semester = formData.get("semester") as string;
  const academicYear = formData.get("academicYear") as string;
  const value = formData.get("value") as string;

  if (!studentId || !subjectId || !semester || !academicYear || !value) {
    return {
      error: "Semua field harus diisi",
    };
  }

  const academicYearPattern = /^\d{4}\/\d{4}$/;
  if (!academicYearPattern.test(academicYear)) {
    return {
      error:
        "Format tahun akademik tidak valid. Gunakan format YYYY/YYYY (contoh: 2023/2024)",
    };
  }

  try {
    const numericValue = parseFloat(value);
    if (numericValue > 100 || numericValue < 0) {
      return {
        error: "Nilai harus antara 0-100",
      };
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return {
        error: "Siswa tidak ditemukan",
      };
    }

    const existingSubject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!existingSubject) {
      return {
        error: "Mata pelajaran tidak ditemukan",
      };
    }

    const scoreExists = await checkScoreExists(
      studentId,
      subjectId,
      semester,
      academicYear
    );

    if (scoreExists) {
      return {
        error:
          "Nilai untuk siswa ini pada mata pelajaran, semester, dan tahun akademik yang sama sudah ada",
      };
    }

    let letterGrade = "";
    if (numericValue >= 90) {
      letterGrade = "A";
    } else if (numericValue >= 80) {
      letterGrade = "B";
    } else if (numericValue >= 70) {
      letterGrade = "C";
    } else if (numericValue >= 60) {
      letterGrade = "D";
    } else {
      letterGrade = "E";
    }

    const createdScore = await prisma.score.create({
      data: {
        subjectId,
        studentId,
        academicYear: encryptDES(academicYear),
        letterGrade: encryptDES(letterGrade),
        semester: encryptDES(semester),
        value: encryptDES(value),
      },
    });

    await createActivity(
      "CREATE",
      "score",
      `Membuat nilai untuk siswa ${decryptDES(existingStudent.name)}`,
      createdScore.id
    );
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan saat menyimpan data",
      };
    }
  }

  revalidatePath("/scores");
  redirect("/scores");
}

export async function updateScore(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const studentId = formData.get("studentId") as string;
  const subjectId = formData.get("subjectId") as string;
  const semester = formData.get("semester") as string;
  const academicYear = formData.get("academicYear") as string;
  const value = formData.get("value") as string;

  if (!id || !studentId || !subjectId || !semester || !academicYear || !value) {
    return {
      error: "Semua field harus diisi",
    };
  }

  const academicYearPattern = /^\d{4}\/\d{4}$/;
  if (!academicYearPattern.test(academicYear)) {
    return {
      error:
        "Format tahun akademik tidak valid. Gunakan format YYYY/YYYY (contoh: 2023/2024)",
    };
  }

  try {
    const existingScore = await prisma.score.findUnique({
      where: { id },
    });

    if (!existingScore) {
      return {
        error: "Data nilai tidak ditemukan",
      };
    }

    const numericValue = parseFloat(value);
    if (numericValue > 100 || numericValue < 0) {
      return {
        error: "Nilai harus antara 0-100",
      };
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return {
        error: "Siswa tidak ditemukan",
      };
    }

    const existingSubject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!existingSubject) {
      return {
        error: "Mata pelajaran tidak ditemukan",
      };
    }

    const scoreExists = await checkScoreExists(
      studentId,
      subjectId,
      semester,
      academicYear,
      id
    );

    if (scoreExists) {
      return {
        error:
          "Nilai untuk siswa ini pada mata pelajaran, semester, dan tahun akademik yang sama sudah ada",
      };
    }

    let letterGrade = "";
    if (numericValue >= 90) {
      letterGrade = "A";
    } else if (numericValue >= 80) {
      letterGrade = "B";
    } else if (numericValue >= 70) {
      letterGrade = "C";
    } else if (numericValue >= 60) {
      letterGrade = "D";
    } else {
      letterGrade = "E";
    }

    await Promise.all([
      prisma.score.update({
        where: { id },
        data: {
          subjectId,
          studentId,
          academicYear: encryptDES(academicYear),
          letterGrade: encryptDES(letterGrade),
          semester: encryptDES(semester),
          value: encryptDES(value),
        },
      }),
      createActivity(
        "UPDATE",
        "score",
        `Memperbarui nilai untuk siswa ${decryptDES(existingStudent.name)}`,
        id
      ),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan saat memperbarui data",
      };
    }
  }

  revalidatePath("/scores");
  redirect("/scores");
}

export async function deleteScore(id: string) {
  try {
    const existingScore = await prisma.score.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!existingScore) {
      throw new Error("Data nilai tidak ditemukan");
    }

    await Promise.all([
      prisma.score.delete({
        where: { id },
      }),
      createActivity(
        "DELETE",
        "score",
        `Menghapus data nilai siswa ${decryptDES(existingScore.student.name)}`,
        id
      ),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Terjadi kesalahan saat menghapus data");
    }
  }
  revalidatePath("/scores");
}
