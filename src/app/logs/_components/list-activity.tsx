"use client";

import type { Prisma } from "@prisma/client";
import { Eye } from "lucide-react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { Pagination } from "@/app/_components/pagination";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type LogsInfo = Prisma.AdminActivityLogGetPayload<{
  include: {
    admin: {
      select: {
        username: true;
        name: true;
      };
    };
  };
}>;

interface Props {
  logs: LogsInfo[];
  pagination: PaginationProps;
}

export const ActivityList = ({ logs, pagination }: Props) => {
  const router = useRouter();
  const columns: TabelColumn<LogsInfo>[] = [
    {
      header: "Waktu",
      accessor: (item) => formatDate(item.createdAt, true),
    },
    {
      header: "Admin",
      accessor: (item) => item.admin.name || "-",
    },
    {
      header: "Aksi",
      accessor: (item) => item.action || "-",
    },
    {
      header: "Deskripsi",
      accessor: (item) => item.description || "-",
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      className: "w-32",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            disabled={!item.entity || !item.entityId}
            onClick={() => router.push(`/${item.entity}/${item.entityId}`)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Daftar Aktivitas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar aktivitas admin SDN 12 Mawasangka
          </p>
        </div>
      </div>

      <Tabel columns={columns} data={logs} />
      <div className="mt-10">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>
    </div>
  );
};
