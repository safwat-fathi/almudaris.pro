import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { mockSelectedHomework, mockSubmissions } from "@/data/mockData";
import { HomeworkSummaryCard } from "@/components/homework/HomeworkSummaryCard";
import { HomeworkStatsGrid } from "@/components/homework/HomeworkStatsGrid";
import { SubmissionCard, type SubmissionCardProps } from "@/components/homework/SubmissionCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "متابعة الواجبات | Al-Mudaris Pro",
    description: "متابعة تسليمات الطلاب للواجبات",
  };
}

export default async function HomeworkSubmissionsPage({ params }: PageProps) {
  // Await params per Next 15 standard
  const resolvedParams = await params;
  const homeworkId = resolvedParams.id;
  
  // Use mock data for now
  const homework = mockSelectedHomework;
  const submissions = mockSubmissions;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/85 backdrop-blur-md flex justify-between items-center px-6 md:px-8 h-16 shadow-none">
        <div className="flex items-center gap-4">
          <Link href="/homework" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors text-slate-600 active:scale-95">
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden ring-2 ring-primary/10 hidden sm:block">
            <img 
              className="w-full h-full object-cover" 
              alt="Teacher Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AVl3FuueheKMO4DkAiQOPa77tZAAZ_VK7JewZBWtYYuyHZhmmuZ7blx4M54ekIIGfCoICEAuTiH5R_oo6-kCncmAw_kOPFiPdxFcUez7VSRlOVYYGETnfySu8lEys2GDrFevewLtRJLl5a1PLQxfAEhv5As0Vpnmhe3HX08umnZBBShbkT1q-IppPbBMFG1XTxmUnBVlxxY8Hq1zlXjZCHaw8qLXFkJv2KH6xOatNiP_48cOYKg6vsnlmFE9sP3M6WLb-s9Z32w" 
            />
          </div>
          <h1 className="font-headline font-bold text-xl md:text-2xl text-on-surface tracking-tight">متابعة الواجبات</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 text-slate-500">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto w-full grow">
        
        {/* Selected Homework Info Card */}
        <HomeworkSummaryCard
          title={homework.title}
          totalStudents={homework.totalStudents}
          submittedCount={homework.submittedCount}
          remainingCount={homework.remainingCount}
        />

        {/* Stats Grid (Bento Style) */}
        <HomeworkStatsGrid
          completionPercentage={homework.completionPercentage}
          delayedCount={homework.delayedCount}
        />

        {/* Student List Header */}
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xl font-bold text-on-surface">قائمة الطلاب</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            تصفية
          </button>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              studentName={submission.studentName}
              status={submission.status as SubmissionCardProps["status"]}
              avatarUrl={submission.avatar}
            />
          ))}
        </div>

      </main>

    </div>
  );
}
