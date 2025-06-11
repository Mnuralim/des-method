"use client";

import type { Prisma, Student, Subject } from "@prisma/client";
import {
  Edit,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Loader2,
  Download,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { Modal } from "@/app/_components/modal";
import { FilterControl1 } from "./filter-controll";
import { Pagination } from "@/app/_components/pagination";
import { deleteScore } from "@/actions/score";
import { ScoreForm } from "./form";

export type ScoreInfo = Prisma.ScoreGetPayload<{
  include: {
    student: true;
    subject: true;
  };
}>;

interface Props {
  scores: ScoreInfo[];
  subjects: Subject[];
  students: Student[];
  modal?: "add" | "edit";
  pagination: PaginationProps;
}

export const ScoreList = ({
  scores,
  modal,
  pagination,
  subjects,
  students,
}: Props) => {
  const [selectedScore, setSelectedScore] = useState<ScoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDecrypted = pagination.preserveParams?.isDecrypted === "true";
  const isModalOpen = modal === "add" || modal === "edit";

  const handleAddClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "add");
    router.push(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleEditScore = (customer: ScoreInfo) => {
    const newParams = new URLSearchParams(searchParams);
    setSelectedScore(customer);
    newParams.set("modal", "edit");
    router.push(`/scores?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    router.back();
    setSelectedScore(null);
  };

  const handleEncryptDecrypt = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (isDecrypted) {
        newParams.delete("isDecrypted");
      } else {
        newParams.set("isDecrypted", "true");
      }
      router.push(`/scores?${newParams.toString()}`, {
        scroll: false,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportToExcel = async () => {
    if (!isDecrypted) {
      alert("Harap dekripsi data terlebih dahulu untuk export");
      return;
    }

    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const exportData = scores.map((score, index) => ({
        No: index + 1,
        "Nama Lengkap": score.student.name || "-",
        Kelas: score.student.grade || "-",
        Semester: score.semester || "-",
        "Tahun Ajaran": score.academicYear || "-",
        "Mata Pelajaran": score.subject.name || "-",
        Nilai: score.value || "-",
        "Kategori Nilai": score.letterGrade || "-",
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => `"${row[header as keyof typeof row] || ""}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `data-siswa-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Data berhasil diekspor ke Excel!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Terjadi kesalahan saat mengekspor data");
    } finally {
      setIsExporting(false);
    }
  };

  const columns: TabelColumn<ScoreInfo>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (
        <span className="text-gray-500 font-medium">
          {(index as number) + 1}
        </span>
      ),
    },
    {
      header: "Nama Lengkap",
      accessor: (item) => item.student.name || "-",
    },
    {
      header: "Kelas",
      accessor: (item) => item.student.grade || "-",
      className: "w-20",
    },
    {
      header: "Semester",
      accessor: (item) => item.semester || "-",
    },
    {
      header: "Tahun Ajaran",
      accessor: (item) => item.academicYear || "-",
    },
    {
      header: "Mata Pelajaran",
      accessor: (item) => item.subject.name || "-",
    },
    {
      header: "Nilai",
      accessor: (item) => item.value || "-",
    },
    {
      header: "Kategori Nilai",
      accessor: (item) => item.letterGrade || "-",
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      className: "w-32",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditScore(item)}
            disabled={!isDecrypted}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit Data"
          >
            <Edit className="w-4 h-4" />
          </button>
          <form action={() => deleteScore(item.id)} className="inline-block">
            <button
              type="submit"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150"
              title="Hapus Data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Nilai Siswa
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola informasi nilai siswa SDN 12 Mawasangka
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportToExcel}
            disabled={isExporting || !isDecrypted}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm ${
              !isDecrypted
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              !isDecrypted ? "Dekripsi data terlebih dahulu" : "Export ke Excel"
            }
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Excel
          </button>
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
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-150 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Nilai
          </button>
        </div>
      </div>

      {!isDecrypted && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center">
            <Lock className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-800 font-medium">
              Mode Terenkripsi: Data sedang ditampilkan dalam bentuk
              terenkripsi. Dekripsi data untuk mengaktifkan fitur export.
            </span>
          </div>
        </div>
      )}

      {isDecrypted ? (
        <FilterControl1
          students={students}
          subjects={subjects}
          currentSortOrder={
            (pagination.preserveParams?.sortOrder as "asc") || "desc"
          }
        />
      ) : null}
      <Tabel columns={columns} data={scores} />
      <div className="mt-10">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ScoreForm
          subjects={subjects}
          modal={modal}
          students={students}
          onClose={handleCloseModal}
          selectedScore={selectedScore}
        />
      </Modal>
    </div>
  );
};
