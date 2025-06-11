"use client";

import { Modal } from "@/app/_components/modal";
import { calculateAge, formatDate } from "@/lib/utils";
import type { Student } from "@prisma/client";
import {
  ArrowLeft,
  Edit,
  User,
  Calendar,
  MapPin,
  BookOpen,
  Clock,
  GraduationCap,
  Home,
  Loader2,
  Unlock,
  Lock,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { StudentForm } from "../../_components/form";

interface Props {
  student: Student;
  isDecrypted: boolean;
  modal?: "edit";
}

export const StudentDetail = ({ student, isDecrypted, modal }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isModalOpen = modal === "edit";

  const handleEncryptDecrypt = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (isDecrypted) {
        newParams.delete("isDecrypted");
      } else {
        newParams.set("isDecrypted", "true");
      }
      router.replace(`/students/${student.id}?${newParams.toString()}`, {
        scroll: false,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "edit");
    router.push(`/students/${student.id}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Detail Siswa
                </h1>
                <p className="text-sm text-gray-600">
                  Informasi lengkap data siswa
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleEncryptDecrypt}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm ${
                  !isDecrypted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={!isDecrypted ? "Decrypt Data" : "Encrypt Data"}
              >
                {!isDecrypted ? (
                  <>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Unlock className="w-4 h-4 mr-2" />
                    )}
                    Dekripsi
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Enkripsi
                  </>
                )}
              </button>
              {isDecrypted ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit Data</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {!isDecrypted && (
        <div className="bg-orange-50 border mt-6 border-orange-200 rounded-lg p-3">
          <div className="flex items-center">
            <Lock className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-800 font-medium">
              Mode Terenkripsi: Data sedang ditampilkan dalam bentuk
              terenkripsi. Dekripsi data untuk mengaktifkan fitur edit.
            </span>
          </div>
        </div>
      )}

      <div className="py-6">
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {student.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  NISN: {student.nisn}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Kelas {student.grade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{calculateAge(student.birthDate)} tahun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Profil Siswa</h3>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informasi Pribadi
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Nama Lengkap
                        </p>
                        <p className="text-sm text-gray-900">{student.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          NISN
                        </p>
                        <p className="text-sm text-gray-900">{student.nisn}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tempat Lahir
                        </p>
                        <p className="text-sm text-gray-900">
                          {student.birthPlace}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tanggal Lahir
                        </p>
                        <p className="text-sm text-gray-900">
                          {isDecrypted
                            ? formatDate(student.birthDate)
                            : student.birthDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Jenis Kelamin
                        </p>
                        <p className="text-sm text-gray-900">
                          {student.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Agama
                        </p>
                        <p className="text-sm text-gray-900">
                          {student.religion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informasi Akademik
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Kelas
                        </p>
                        <p className="text-sm text-gray-900">{student.grade}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Terdaftar Sejak
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDate(student.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Alamat
                        </p>
                        <p className="text-sm text-gray-900">
                          {student.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal onClose={handleClose} isOpen={isModalOpen}>
        <StudentForm selectedStudent={student} onClose={handleClose} />
      </Modal>
    </div>
  );
};
