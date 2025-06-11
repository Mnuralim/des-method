import React from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentSortOrder?: string;
}

export const FilterControl1 = ({ currentSortOrder }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.trim() === "") {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("search");
        replace(`/students?${newParams.toString()}`, {
          scroll: false,
        });
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("search", e.target.value);
        replace(`/students?${newParams.toString()}`, {
          scroll: false,
        });
      }
    },
    500
  );

  const handleFilterGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("grade");
    } else {
      newParams.set("grade", e.target.value);
    }
    replace(`/students?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterReligion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "all") {
      newParams.delete("religion");
    } else {
      newParams.set("religion", e.target.value);
    }
    replace(`/students?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/students?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Cari siswa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid gap-2 grid-cols-3">
          <select
            onChange={handleFilterGrade}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Kelas</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
          </select>
          <select
            onChange={handleFilterReligion}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Semua Agama</option>
            <option value="islam">Islam</option>
            <option value="kristen">Kristen</option>
            <option value="hindu">Hindu</option>
            <option value="buddha">Buddha</option>
            <option value="konghucu">Konghucu</option>
          </select>
          <button
            onClick={handleSortOrder}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200 flex items-center gap-2"
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
