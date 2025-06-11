"use client";

import React from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  Activity,
  Clock,
  FileText,
  ActivityIcon,
} from "lucide-react";
import type { AdminActivityLog } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Props {
  totalStudents: number;
  totalSubjects: number;
  totalScores: number;
  recentActivities: AdminActivityLog[];
  totalActivities: number;
}

export const Dashboard = ({
  recentActivities,
  totalActivities,
  totalScores,
  totalStudents,
  totalSubjects,
}: Props) => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-gray-900 rounded-full"></div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Selamat datang di sistem informasi SDN 12 MAWASANGKA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalStudents}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Mata Pelajaran
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalSubjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Nilai</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalScores}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Aktivitas Hari Ini
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalActivities}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Aktivitas Terbaru
            </h3>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      {activity.entity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.createdAt, true)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-0">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-left">
              <Link href={"/students?modal=add"} className="w-full h-full">
                <Users className="w-6 h-6 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Tambah Siswa
                </p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-left">
              <Link href={"/scores?modal=add"} className="w-full h-full">
                <GraduationCap className="w-6 h-6 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">Input Nilai</p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-left">
              <Link href={"/logs"} className="w-full h-full">
                <ActivityIcon className="w-6 h-6 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Riwayat Aktivitas
                </p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-left">
              <Link href={"/tutorials"} className="w-full h-full">
                <FileText className="w-6 h-6 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Panduan Aplikasi
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
