import { getAllSubjects } from "@/actions/subject";
import { ScoreList } from "./_components/score-list";
import { getAllScores } from "@/actions/score";
import { getAllStudents } from "@/actions/students";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ScoresPage({ searchParams }: Props) {
  const {
    modal,
    semester,
    limit,
    student,
    skip,
    subject,
    sortOrder,
    academicYear,
    isDecrypted,
    grade,
  } = await searchParams;
  const [scoresResult, subjectsResult, studentsResult] = await Promise.all([
    getAllScores(
      isDecrypted === "true" ? true : false,
      limit || "10",
      skip || "0",
      student,
      subject,
      semester,
      academicYear,
      sortOrder,
      grade
    ),
    getAllSubjects(true),
    getAllStudents(true, "1000000", "0"),
  ]);

  return (
    <main className="w-full px-4 sm:px-6 md:px-8 py-8 min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Grades Management
          </h1>
          <p className="text-gray-600 mt-2">Kelola data nilai siswa di sini.</p>
        </div>
        <div className="p-6">
          <ScoreList
            scores={scoresResult.scores}
            subjects={subjectsResult.subjects}
            students={studentsResult.students}
            modal={modal as "add" | "edit"}
            pagination={{
              currentPage: scoresResult.currentPage,
              totalPages: scoresResult.totalPages,
              totalItems: scoresResult.totalCount,
              itemsPerPage: scoresResult.itemsPerPage,
              preserveParams: {
                limit,
                skip,
                student,
                subject,
                semester,
                academicYear,
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
