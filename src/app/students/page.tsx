import { getAllStudents } from "@/actions/students";
import { StudentList } from "./_components/student-list";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function StudentsPage({ searchParams }: Props) {
  const {
    modal,
    search,
    limit,
    religion,
    skip,
    grade,
    sortOrder,
    isDecrypted,
  } = await searchParams;
  const result = await getAllStudents(
    isDecrypted === "true" ? true : false,
    limit || "10",
    skip || "0",
    search,
    religion,
    grade,
    sortOrder
  );

  return (
    <main className="w-full px-4 sm:px-6 md:px-8 py-8 min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Students Management
          </h1>
          <p className="text-gray-600 mt-2">Kelola data siswa di sini.</p>
        </div>
        <div className="p-6">
          <StudentList
            students={result.students}
            modal={modal as "add" | "edit"}
            pagination={{
              currentPage: result.currentPage,
              totalPages: result.totalPages,
              totalItems: result.totalCount,
              itemsPerPage: result.itemsPerPage,
              preserveParams: {
                search,
                limit,
                religion,
                skip,
                grade,
                sortOrder,
                isDecrypted,
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
