"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decryptDES, encryptDES } from "@/lib/des";
import { createActivity } from "./activity";

export async function getAllStudents(
  isDecrypted: boolean,
  limit: string,
  skip: string,
  search?: string,
  religion?: string,
  grade?: string,
  sortOrder?: string
) {
  let students = await prisma.student.findMany({
    take: parseInt(limit),
    skip: parseInt(skip),
    orderBy: {
      createdAt: sortOrder === "asc" ? "asc" : "desc",
    },
  });

  if (isDecrypted) {
    students = students.map((student) => ({
      ...student,
      name: decryptDES(student.name),
      nisn: decryptDES(student.nisn),
      birthPlace: decryptDES(student.birthPlace),
      birthDate: decryptDES(student.birthDate),
      address: decryptDES(student.address),
      religion: decryptDES(student.religion),
      grade: decryptDES(student.grade),
      gender: decryptDES(student.gender),
    }));
  }

  if (search) {
    students = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (religion) {
    students = students.filter(
      (student) => student.religion.toLowerCase() === religion.toLowerCase()
    );
  }

  if (grade) {
    students = students.filter(
      (student) => student.grade.toLowerCase() === grade.toLowerCase()
    );
  }

  return {
    students,
    totalCount: students.length,
    currentPage: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
    totalPages: Math.ceil(students.length / parseInt(limit)),
    itemsPerPage: parseInt(limit),
  };
}

export async function getStudentById(id: string, isDecrypted: boolean) {
  const student = await prisma.student.findUnique({
    where: {
      id: id,
    },
  });

  if (!student) {
    return null;
  }

  if (isDecrypted) {
    return {
      ...student,
      name: decryptDES(student.name),
      nisn: decryptDES(student.nisn),
      birthPlace: decryptDES(student.birthPlace),
      birthDate: decryptDES(student.birthDate),
      address: decryptDES(student.address),
      religion: decryptDES(student.religion),
      grade: decryptDES(student.grade),
      gender: decryptDES(student.gender),
      student,
    };
  }

  return student;
}

export async function createStudent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  const name = formData.get("name") as string;
  const nisn = formData.get("nisn") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const address = formData.get("address") as string;
  const birthDate = formData.get("birthDate") as string;
  const religion = formData.get("religion") as string;
  const grade = formData.get("grade") as string;
  const gender = formData.get("gender") as string;

  if (
    !name ||
    !nisn ||
    !birthPlace ||
    !address ||
    !birthDate ||
    !religion ||
    !grade ||
    !gender
  ) {
    return {
      error: "Semua field harus diisi",
    };
  }

  try {
    const allStudents = await prisma.student.findMany();
    const nisnExists = allStudents.some((student) => {
      return decryptDES(student.nisn) === nisn;
    });

    if (nisnExists) {
      return {
        error: "NISN sudah terdaftar",
      };
    }

    const createdStudent = await prisma.student.create({
      data: {
        name: encryptDES(name),
        nisn: encryptDES(nisn),
        birthPlace: encryptDES(birthPlace),
        address: encryptDES(address),
        birthDate: encryptDES(birthDate),
        religion: encryptDES(religion),
        grade: encryptDES(grade),
        adminId: session!.id,
        gender: encryptDES(gender),
      },
    });

    await createActivity(
      "CREATE",
      "student",
      `Menambahkan siswa ${decryptDES(createdStudent.name)}`,
      createdStudent.id
    );
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function updateStudent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const nisn = formData.get("nisn") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const address = formData.get("address") as string;
  const birthDate = formData.get("birthDate") as string;
  const religion = formData.get("religion") as string;
  const grade = formData.get("grade") as string;
  const gender = formData.get("gender") as string;

  if (
    !name ||
    !nisn ||
    !birthPlace ||
    !address ||
    !birthDate ||
    !religion ||
    !grade ||
    !gender
  ) {
    return {
      error: "Semua field harus diisi",
    };
  }

  try {
    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      return {
        error: "Data siswa tidak ditemukan",
      };
    }

    const allStudents = await prisma.student.findMany({
      where: {
        NOT: {
          id,
        },
      },
      select: {
        id: true,
        nisn: true,
      },
    });

    const isDuplicateNisn = allStudents.some((student) => {
      const decryptedNisn = decryptDES(student.nisn);
      return decryptedNisn === nisn;
    });

    if (isDuplicateNisn) {
      return {
        error: "NISN sudah terdaftar oleh siswa lain",
      };
    }

    await Promise.all([
      prisma.student.update({
        where: {
          id,
        },
        data: {
          name: encryptDES(name),
          nisn: encryptDES(nisn),
          birthPlace: encryptDES(birthPlace),
          address: encryptDES(address),
          birthDate: encryptDES(birthDate),
          religion: encryptDES(religion),
          grade: encryptDES(grade),
          gender: encryptDES(gender),
        },
      }),
      createActivity(
        "UPDATE",
        "student",
        `Mengubah data siswa ${decryptDES(existingStudent.name)}`,
        existingStudent.id
      ),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function deleteStudent(id: string) {
  try {
    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      throw new Error("Data siswa tidak ditemukan");
    }
    await Promise.all([
      prisma.student.delete({
        where: {
          id,
        },
      }),
      createActivity(
        "DELETE",
        "student",
        `Menghapus data siswa ${decryptDES(existingStudent.name)}`,
        id
      ),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
  revalidatePath("/students");
}
