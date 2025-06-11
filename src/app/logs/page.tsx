import { getActivities } from "@/actions/activity";
import { ActivityList } from "./_components/list-activity";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function Logs({ searchParams }: Props) {
  const { limit, skip } = await searchParams;
  const logsResult = await getActivities(skip || "0", limit || "10");
  return (
    <main className="w-full px-4 sm:px-6 md:px-8 py-8 min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Logs Activity
          </h1>
          <p className="text-gray-600 mt-2">Lihat log aktivitas di sini.</p>
        </div>
        <div className="p-6">
          <ActivityList
            logs={logsResult.activities}
            pagination={{
              currentPage: logsResult.currentPage,
              itemsPerPage: logsResult.itemsPerPage,
              totalPages: logsResult.totalPages,
              totalItems: logsResult.totalCount,
              preserveParams: {
                limit,
                skip,
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
