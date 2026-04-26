import React from "react";

export interface HomeworkSummaryCardProps {
  title: string;
  totalStudents: number;
  submittedCount: number;
  remainingCount: number;
}

export function HomeworkSummaryCard({
  title,
  totalStudents,
  submittedCount,
  remainingCount,
}: HomeworkSummaryCardProps) {
  // Calculate percentage for progress bar
  const percentage = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;

  return (
    <section className="bg-primary-container rounded-xl p-8 mb-8 relative overflow-hidden text-on-primary-container shadow-lg">
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDF9Kgi1SMxTmQeqf5YeNp2yO23B1QJ4btPD6sWtBjTbRYRtOJXOgfpTIh_uU3DPxCMtlsrF0tNu2Lieo1_2gp424GE7rqSD3MPLSsko6zPxwtPNFGTzBvRPfBTCFCEZafVZyGg6YAkUOUP1G95d3QdKMXcQz0EmHr3KNtutt64bmCaxqOK84z1ARZn3R7rifNFwDqEhd4HK6u9fCGLIu7X9nLHuy78ngbKsQp-7enBEWS4MHf2GAw6Mhj2P7W0I2yUv5Snpn5HAc')" }}
      ></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest opacity-80 block mb-1">الواجب الحالي</span>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center min-w-[80px]">
            <span className="block text-3xl font-black">{submittedCount}</span>
            <span className="text-[10px] font-bold opacity-80">تم التسليم</span>
          </div>
        </div>
        
        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-3 text-sm font-medium">
          <span>إجمالي الطلاب: {totalStudents}</span>
          <span>المتبقي: {remainingCount}</span>
        </div>
      </div>
    </section>
  );
}
