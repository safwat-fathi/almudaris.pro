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
    <section className="bg-primary-container rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden text-on-primary-container shadow-lg">
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-cover bg-center" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDF9Kgi1SMxTmQeqf5YeNp2yO23B1QJ4btPD6sWtBjTbRYRtOJXOgfpTIh_uU3DPxCMtlsrF0tNu2Lieo1_2gp424GE7rqSD3MPLSsko6zPxwtPNFGTzBvRPfBTCFCEZafVZyGg6YAkUOUP1G95d3QdKMXcQz0EmHr3KNtutt64bmCaxqOK84z1ARZn3R7rifNFwDqEhd4HK6u9fCGLIu7X9nLHuy78ngbKsQp-7enBEWS4MHf2GAw6Mhj2P7W0I2yUv5Snpn5HAc')" }}
      ></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest opacity-80 block mb-1 font-body">الواجب الحالي</span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight font-headline text-white">{title}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center min-w-[70px] md:min-w-[80px] shadow-sm border border-white/10">
            <span className="block text-2xl md:text-3xl font-black text-white font-headline">{submittedCount}</span>
            <span className="text-[10px] font-bold opacity-90 text-white uppercase tracking-wider">تم التسليم</span>
          </div>
        </div>
        
        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-6 mb-3" dir="rtl">
          <div 
            className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm font-medium text-white/90 font-body">
          <span>إجمالي الطلاب: {totalStudents}</span>
          <span>المتبقي: {remainingCount}</span>
        </div>
      </div>
    </section>
  );
}
