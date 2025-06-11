import React from "react";
import { SortAsc, SortDesc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Student, Subject } from "@prisma/client";

interface Props {
  currentSortOrder?: string;
  students: Student[];
  subjects: Subject[];
}

export const FilterControl1 = ({
  currentSortOrder,
  students,
  subjects,
}: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleFilterGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("grade");
    } else {
      newParams.set("grade", e.target.value);
    }
    replace(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterStudentList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("student");
    } else {
      newParams.set("student", e.target.value);
    }
    replace(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("subject");
    } else {
      newParams.set("subject", e.target.value);
    }
    replace(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterSemester = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("semester");
    } else {
      newParams.set("semester", e.target.value);
    }
    replace(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterAcademicYear = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("academicYear");
    } else {
      newParams.set("academicYear", e.target.value);
    }
    replace(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
          <select
            onChange={handleFilterStudentList}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Daftar Siswa</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <select
            onChange={handleFilterGrade}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Kelas</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
          </select>
          <select
            onChange={handleFilterSubject}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Pelajaran</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
          <select
            onChange={handleFilterSemester}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <select
            onChange={handleFilterAcademicYear}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Tahun Akademik</option>
            <option value="2021-2022">2021/2022</option>
            <option value="2022-2023">2022/2023</option>
            <option value="2023-2024">2023/2024</option>
            <option value="2024-2025">2024/2025</option>
            <option value="2025-2026">2025/2026</option>
            <option value="2026-2027">2026/2027</option>
          </select>
          <button
            onClick={handleSortOrder}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200 flex items-center justify-center gap-2"
            title={`Urutkan tanggal ${
              currentSortOrder === "asc"
                ? "terbaru ke terlama"
                : "terlama ke terbaru"
            }`}
          >
            {currentSortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {currentSortOrder === "asc" ? "Terbaru" : "Terlama"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
