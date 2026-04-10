import React from "react";

export interface SubmissionCardProps {
  studentName: string;
  status: "submitted" | "not_submitted";
  avatarUrl: string;
}

export function SubmissionCard({
  studentName,
  status,
  avatarUrl,
}: SubmissionCardProps) {
  const isSubmitted = status === "submitted";

  return (
    <div
      className={`bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between shadow-sm border-r-4 hover:shadow-md transition-shadow ${
        isSubmitted ? "border-secondary" : "border-tertiary"
      }`}
    >
      <div className={`flex items-center gap-4 ${!isSubmitted ? "opacity-80" : ""}`}>
        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
          <img
            className={`w-full h-full object-cover ${!isSubmitted ? "grayscale-30" : ""}`}
            alt={studentName}
            src={avatarUrl}
          />
        </div>
        <div>
          <h4 className="font-bold text-on-surface font-headline text-[15px]">
            {studentName}
          </h4>
          <div
            className={`items-center gap-1 text-xs font-bold mt-1 px-2 py-0.5 rounded-md inline-flex ${
              isSubmitted
                ? "text-on-secondary-container bg-secondary-container/30"
                : "text-tertiary bg-tertiary-container/30"
            }`}
          >
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isSubmitted ? "check_circle" : "cancel"}
            </span>
            {isSubmitted ? "تم التسليم" : "لم يتم التسليم"}
          </div>
        </div>
      </div>
      {isSubmitted ? (
        <button className="bg-primary/10 text-primary px-3 py-2 md:px-4 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform hover:bg-primary/20">
          <span className="hidden sm:inline">مشاهدة الحل</span>
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
        </button>
      ) : (
        <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform hover:bg-surface-container-highest hover:text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span className="hidden sm:inline">تنبيه</span>
        </button>
      )}
    </div>
  );
}
