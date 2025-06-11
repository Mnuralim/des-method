import { getStudentById } from "@/actions/students";
import { StudentDetail } from "./_components/detail-student";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function DetailStudentPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { isDecrypted, modal } = await searchParams;
  const student = await getStudentById(
    id,
    isDecrypted === "true" ? true : false
  );

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 px-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Data Siswa Tidak Ditemukan
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 px-3 ">
      <StudentDetail
        student={student}
        isDecrypted={isDecrypted === "true"}
        modal={modal as "edit"}
      />
    </div>
  );
}
