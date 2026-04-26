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
      className={`bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between shadow-sm border-r-4 ${
        isSubmitted ? "border-secondary" : "border-tertiary"
      }`}
    >
      <div className={`flex items-center gap-4 ${!isSubmitted ? "opacity-70" : ""}`}>
        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt={studentName}
            src={avatarUrl}
          />
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{studentName}</h4>
          <div
            className={`flex items-center gap-1 text-xs font-bold mt-1 ${
              isSubmitted ? "text-on-secondary-container" : "text-tertiary"
            }`}
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isSubmitted ? "check_circle" : "cancel"}
            </span>
            {isSubmitted ? "تم التسليم" : "لم يتم التسليم"}
          </div>
        </div>
      </div>
      {isSubmitted ? (
        <button className="bg-primary/10 text-primary px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform">
          <span>مشاهدة الحل</span>
          <span className="material-symbols-outlined text-lg">
            visibility
          </span>
        </button>
      ) : (
        <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-md font-bold text-sm active:scale-95 transition-transform">
          تنبيه
        </button>
      )}
    </div>
  );
}
