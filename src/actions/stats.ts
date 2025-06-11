"use server";

import prisma from "@/lib/prisma";

export async function getStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [
    studentsCount,
    subjectsCount,
    scoresCount,
    activitiesCount,
    recentAcitvity,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.subject.count(),
    prisma.score.count(),
    prisma.adminActivityLog.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    prisma.adminActivityLog.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);
  return {
    studentsCount,
    subjectsCount,
    scoresCount,
    activitiesCount,
    recentAcitvity,
  };
}
