"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface SessionFormProps {
  isEdit?: boolean;
  initialData?: {
    name?: string;
    group?: string;
    date?: string;
    price?: string;
    location?: "center" | "online";
  };
}

export default function SessionForm({ isEdit = false, initialData }: SessionFormProps) {
  const router = useRouter();
  
  // Form State
  const [sessionName, setSessionName] = useState(initialData?.name || "");
  const [selectedGroup, setSelectedGroup] = useState(initialData?.group || "تالتة ثانوي");
  const [date, setDate] = useState(initialData?.date || "اليوم");
  const [price, setPrice] = useState(initialData?.price || "40 جنيه");
  const [location, setLocation] = useState<"center" | "online">(initialData?.location || "center");
  const [applyToAll, setApplyToAll] = useState(true);
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const handleSave = () => {
    // In a real app, API call goes here before navigation
    console.log("Saving session...", { sessionName, selectedGroup, date, price, location, applyToAll, repeatWeekly });
    router.push("/sessions");
  };

  return (
    <>
      <section className="mt-8 space-y-6">
        {/* Session Name */}
        <div className="space-y-2">
          <label className="text-on-surface font-semibold px-1">اسم الحصة</label>
          <Input 
            type="text" 
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="مثال: مراجعة الباب الأول"
            icon="edit"
          />
        </div>

        {/* Group Picker */}
        <div className="space-y-2">
          <label className="text-on-surface font-semibold px-1">الدفعة</label>
          <Select 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="تالتة ثانوي">تالتة ثانوي</option>
            <option value="تانية ثانوي">تانية ثانوي</option>
            <option value="أولى ثانوي">أولى ثانوي</option>
          </Select>
        </div>

        {/* Date & Price Row*/}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-on-surface font-semibold px-1">التاريخ</label>
            <Input 
              type="text" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              icon="calendar_today"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-on-surface font-semibold px-1">سعر الحصة</label>
            <Input 
              type="text" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              icon="payments"
            />
          </div>
        </div>

        {/* Time Picker View */}
        <div className="space-y-2">
          <label className="text-on-surface font-semibold px-1">موعد الحصة</label>
          <div className="flex items-center gap-3 bg-surface-container-lowest p-2 rounded-lg border border-transparent hover:border-outline-variant transition-colors cursor-pointer">
             <div className="px-3">
              <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low py-3 rounded-md">
              <span className="text-[10px] text-primary uppercase font-bold mb-1">من</span>
              <span className="text-lg font-bold text-on-surface">05:00 م</span>
            </div>
            <div className="w-8 h-px bg-outline-variant"></div>
            <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low py-3 rounded-md">
              <span className="text-[10px] text-primary uppercase font-bold mb-1">إلى</span>
              <span className="text-lg font-bold text-on-surface">06:30 م</span>
            </div>
          </div>
        </div>

        {/* Location Picker */}
        <div className="space-y-2">
          <label className="text-on-surface font-semibold px-1">المكان</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => setLocation("center")}
              className={`h-16 flex items-center justify-center gap-2 rounded-lg font-bold transition-all ${
                location === "center" 
                ? "border-2 border-primary bg-primary/10 text-primary" 
                : "bg-surface-container-lowest text-outline font-medium hover:border-2 hover:border-outline-variant"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: location === "center" ? "'FILL' 1" : "'FILL' 0" }}>location_on</span>
              سنتر
            </button>
            <button 
              type="button"
              onClick={() => setLocation("online")}
              className={`h-16 flex items-center justify-center gap-2 rounded-lg font-bold transition-all ${
                location === "online" 
                ? "border-2 border-primary bg-primary/10 text-primary" 
                : "bg-surface-container-lowest text-outline font-medium hover:border-2 hover:border-outline-variant"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: location === "online" ? "'FILL' 1" : "'FILL' 0" }}>language</span>
              أونلاين
            </button>
          </div>
        </div>

        {/* Smart Options (Toggles) */}
        
          <div className="pt-4 space-y-4">
            {/* Apply to All Toggle */}
            <button 
              type="button"
              className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors"
              onClick={() => setApplyToAll(!applyToAll)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">group_add</span>
                </div>
                <span className="font-bold font-manrope text-on-surface">تطبيق على كل الطلاب</span>
              </div>
              
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${applyToAll ? "bg-primary" : "bg-outline-variant"}`}>
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${applyToAll ? "left-1" : "left-7"}`} />
              </div>
            </button>
  
            {/* Repeat Weekly Toggle */}
            <button 
                  type="button"
                  className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors"
              onClick={() => setRepeatWeekly(!repeatWeekly)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary-container">repeat</span>
                </div>
                <span className="font-bold font-manrope text-on-surface">تكرار الحصة أسبوعيًا</span>
              </div>
              
               <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${repeatWeekly ? "bg-primary" : "bg-outline-variant"}`}>
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${repeatWeekly ? "left-1" : "left-7"}`} />
              </div>
            </button>
          </div>
        
      </section>

      {/* Bottom CTA Wrapper */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/10 z-50">
        <button 
          onClick={handleSave}
          className="w-full h-16 bg-primary text-on-primary rounded-full font-manrope font-extrabold text-xl shadow-lg hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all duration-150 flex items-center justify-center gap-3"
        >
          {isEdit ? "حفظ التعديلات" : "حفظ الحصة"}
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </button>
      </div>
    </>
  );
}
