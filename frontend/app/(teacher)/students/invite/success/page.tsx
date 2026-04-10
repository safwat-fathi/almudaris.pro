"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InviteSuccessPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Fake generated invite link & code
  const generatedLink = "https://app.com/invite/abc123";
  const classCode = "A7X9K2";

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setShowToast(true);
    
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col gap-4 items-center">
      {/* Top Navigation */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
        <div className="relative flex items-center px-6 md:px-12 py-4 w-full max-w-7xl mx-auto min-h-[72px]">
          <button 
            onClick={() => router.push("/students")}
            className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out absolute inset-s-6 md:inset-s-12 z-10"
          >
            arrow_back
          </button>
          <div className="w-full flex justify-center pointer-events-none">
            <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">Al-Mudaris Pro</h1>
          </div>
        </div>
      </header>

      <main className="grow flex flex-col items-center justify-center px-8 max-w-2xl mx-auto w-full">
        {/* Success Animation/Graphic Area */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-secondary-container/30 rounded-full blur-3xl scale-150"></div>
          <div className="relative w-24 h-24 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-5xl" style={{ fontSize: "3rem", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-4 tracking-tight">✅ تم إنشاء الدعوة</h1>
          <p className="text-on-surface-variant font-body leading-relaxed max-w-xs mx-auto">
            شارك الرابط مع الطلاب أو أولياء الأمور لينضموا فورًا
          </p>
        </div>

        {/* Invitation Details Bento Card */}
        <div className="w-full space-y-4 mb-10">
          {/* Link Card */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col gap-3 group active:bg-surface-container-high transition-colors duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-body uppercase tracking-widest text-outline">رابط الانضمام</span>
              <span className="material-symbols-outlined text-primary">link</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <code className="text-lg font-semibold text-on-surface break-all" dir="ltr">{generatedLink}</code>
            </div>
          </div>

          {/* Code Card */}
          <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-body uppercase tracking-widest text-outline">رمز الفصل</span>
              <span className="material-symbols-outlined text-primary">qr_code</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <span className="text-4xl font-black tracking-[0.5em] text-primary-container font-mono">{classCode}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4">
          {/* Primary Action: WhatsApp */}
          <button className="h-16 w-full bg-secondary text-on-secondary rounded-full flex items-center justify-center gap-3 font-bold text-lg shadow-md active:scale-95 transition-transform duration-150">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
            <span className="font-headline">مشاركة عبر واتساب</span>
          </button>
          
          {/* Secondary Action: Copy */}
          <button 
            onClick={handleCopy}
            className="h-16 w-full bg-surface-container-high text-primary rounded-full flex items-center justify-center gap-3 font-bold text-lg active:scale-95 transition-transform duration-150"
          >
            <span className="material-symbols-outlined">content_copy</span>
            <span className="font-headline">نسخ الرابط</span>
          </button>
        </div>

        {/* Decorative Illustration */}
        {/* <div className="mt-16 w-full overflow-hidden rounded-xl h-48 opacity-80 mix-blend-multiply">
          <img 
            alt="Students connecting digitally" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr0eaLjIzwfczUOfE6mHZA7iSWZZw_Rchlfw3GX5vt9UvQjljmqBfN_W8DKEO4dIepUSL0oVrmSG5F25gDcYzWsgTWWF3qpVlVv32OHQc4rQiRRcnIri8Ukpf9uvOFxqFPnHSVHK11kQVEU16_Z2YPtpgeJbODr2R0PSG8tlrGCQ34sfeUscIH7CBPQZpokL-8MhJusIIYMhddmnH2FKhkRK5jGRGB6kqaeV0Mn9i5srOkTM6ZzIHJ_QjVtje6pQftQ1WrfXDTLbo"
          />
        </div> */}
      </main>

      {/* Toast/Feedback Simulation */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full shadow-lg flex items-center gap-3 transition-all duration-300 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
        <span className="text-sm font-medium font-body">تم نسخ الرابط بنجاح</span>
      </div>
    </div>
  );
}
