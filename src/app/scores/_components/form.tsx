"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { BookOpen, Calendar, GraduationCap, Trophy } from "lucide-react";
import { ErrorMessage } from "@/app/_components/error-message";
import type { ScoreInfo } from "@/app/scores/_components/score-list";
import { createScore } from "@/actions/score";
import type { Student, Subject } from "@prisma/client";
// import { updateScore } from "@/actions/score"; // Assuming you have this action

interface Props {
  modal?: "add" | "edit";
  selectedScore?: ScoreInfo | null;
  onClose: () => void;
  students?: Student[];
  subjects?: Subject[];
}

export const ScoreForm = ({
  modal,
  selectedScore,
  onClose,
  students = [],
  subjects = [],
}: Props) => {
  const [createState, createAction] = useActionState(createScore, {
    error: null,
  });

  const [updateState, updateAction] = useActionState(createScore, {
    error: null,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {modal === "add" ? "Tambah Nilai Baru" : "Edit Nilai"}
        </h2>
        <p className="text-sm text-gray-600">
          {modal === "add"
            ? "Lengkapi informasi nilai untuk menambahkan data baru"
            : "Perbarui informasi nilai sesuai kebutuhan"}
        </p>
      </div>

      <form
        action={modal === "add" ? createAction : updateAction}
        className="space-y-6"
      >
        <input type="hidden" name="id" defaultValue={selectedScore?.id} />
        <ErrorMessage
          message={modal === "add" ? createState.error : updateState.error}
        />

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Siswa
            </h3>
          </div>

          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pilih Siswa *
            </label>
            <select
              id="studentId"
              name="studentId"
              defaultValue={selectedScore?.studentId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              required
            >
              <option value="">Pilih siswa</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.nisn} (Kelas {student.grade})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Mata Pelajaran
            </h3>
          </div>

          <div>
            <label
              htmlFor="subjectId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pilih Mata Pelajaran *
            </label>
            <select
              id="subjectId"
              name="subjectId"
              defaultValue={selectedScore?.subjectId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              required
            >
              <option value="">Pilih mata pelajaran</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Academic Period */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Periode Akademik
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Semester *
              </label>
              <select
                id="semester"
                name="semester"
                defaultValue={selectedScore?.semester}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="academicYear"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tahun Akademik *
              </label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                placeholder="Contoh: 2023/2024"
                defaultValue={selectedScore?.academicYear}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                pattern="\d{4}/\d{4}"
                title="Format: YYYY/YYYY (contoh: 2023/2024)"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Trophy className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Nilai</h3>
          </div>

          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nilai (0-100) *
            </label>
            <input
              type="number"
              id="value"
              name="value"
              min="0"
              max="100"
              step="0.1"
              placeholder="Masukkan nilai (contoh: 85.5)"
              defaultValue={selectedScore?.value}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Nilai akan otomatis dikonversi ke grade huruf (A, B, C, D, E)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Batal
          </button>
          <SubmitButton modalMode={modal as "add" | "edit"} />
        </div>
      </form>
    </div>
  );
};
