"use server";

import { decryptDES } from "@/lib/des";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getAllSubjects = unstable_cache(async function getAllSubjects(
  isDecrypted: boolean
) {
  let subjects = await prisma.subject.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (isDecrypted) {
    subjects = subjects.map((subject) => ({
      ...subject,
      name: decryptDES(subject.name),
      code: decryptDES(subject.code),
    }));
  }
  return {
    subjects,
    totalCount: subjects.length,
  };
});
