"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { createStudent, updateStudent } from "@/actions/students";
import type { Student } from "@prisma/client";
import { BookOpen, Calendar, MapPin, User } from "lucide-react";
import { ErrorMessage } from "@/app/_components/error-message";

interface Props {
  modal?: "add" | "edit";
  selectedStudent?: Student | null;
  onClose: () => void;
}

export const StudentForm = ({ modal, selectedStudent, onClose }: Props) => {
  const [createState, createAction] = useActionState(createStudent, {
    error: null,
  });

  const [updateState, updateAction] = useActionState(updateStudent, {
    error: null,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {modal === "add" ? "Tambah Siswa Baru" : "Edit Data Siswa"}
        </h2>
        <p className="text-sm text-gray-600">
          {modal === "add"
            ? "Lengkapi informasi siswa untuk menambahkan data baru"
            : "Perbarui informasi siswa sesuai kebutuhan"}
        </p>
      </div>

      <form
        action={modal === "add" ? createAction : updateAction}
        className="space-y-6"
      >
        <input type="hidden" name="id" defaultValue={selectedStudent?.id} />
        <ErrorMessage
          message={modal === "add" ? createState.error : updateState.error}
        />
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Pribadi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap siswa"
                defaultValue={selectedStudent?.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nisn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NISN *
              </label>
              <input
                type="text"
                id="nisn"
                name="nisn"
                maxLength={4}
                defaultValue={selectedStudent?.nisn}
                placeholder="Nomor Induk Siswa Nasional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150 font-mono"
                required
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Jenis Kelamin *
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={selectedStudent?.gender}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Tempat & Tanggal Lahir
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="birthPlace"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tempat Lahir *
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                defaultValue={selectedStudent?.birthPlace}
                placeholder="Kota tempat lahir"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Lahir *
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                defaultValue={selectedStudent?.birthDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Akademik
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kelas *
              </label>
              <select
                id="grade"
                name="grade"
                defaultValue={selectedStudent?.grade}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih kelas</option>
                <option value="1">Kelas 1</option>
                <option value="2">Kelas 2</option>
                <option value="3">Kelas 3</option>
                <option value="4">Kelas 4</option>
                <option value="5">Kelas 5</option>
                <option value="6">Kelas 6</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="religion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Agama *
              </label>
              <select
                id="religion"
                name="religion"
                defaultValue={selectedStudent?.religion}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih agama</option>
                <option value="islam">Islam</option>
                <option value="kristen protestan">Kristen Protestan</option>
                <option value="kristen katolik">Kristen Katolik</option>
                <option value="hindu">Hindu</option>
                <option value="buddha">Buddha</option>
                <option value="konghucu">Konghucu</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Alamat</h3>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Alamat Lengkap *
            </label>
            <textarea
              id="address"
              name="address"
              defaultValue={selectedStudent?.address}
              placeholder="Masukkan alamat lengkap siswa"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150 resize-vertical"
              required
            />
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
