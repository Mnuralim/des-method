import { getStats } from "@/actions/stats";
import { Dashboard } from "./_components/dashboard";

export default async function Home() {
  const stats = await getStats();
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-8 min-h-screen bg-gray-50">
      <Dashboard
        recentActivities={stats.recentAcitvity}
        totalActivities={stats.activitiesCount}
        totalScores={stats.scoresCount}
        totalStudents={stats.studentsCount}
        totalSubjects={stats.subjectsCount}
      />
    </div>
  );
}
