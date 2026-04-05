export default function StudentsPromotion() {
  return (
    <div className="mt-24 relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary to-primary-container p-8 text-on-primary md:flex items-center justify-between shadow-[0_16px_40px_rgba(26,115,232,0.2)]">
      <div className="relative z-10 basis-2/3">
        <h4 className="text-2xl font-extrabold mb-3 font-headline tracking-tight">تعزيز التواصل</h4>
        <p className="opacity-90 max-w-md font-body text-sm leading-relaxed">
          استخدم نظام التذكير الآلي لإرسال إشعارات للطلاب الذين لم ينضموا بعد للدورة التدريبية لضمان عدم تفويتهم أي من المهام أو التحديثات.
        </p>
      </div>
      <img 
        className="absolute left-0 bottom-0 opacity-20 w-1/2 md:w-1/3 h-full object-cover pointer-events-none mix-blend-overlay" 
        alt="" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSvvWalAdV6OYzjMs7lsPwiaSSeJlvxacBv2zb9SWaTSp5U-JyuPkPN2wg_SB190dTAeBvwaXC4qUp9ZI7JckOVK5Z9ex9xumDxEtSL2ssZK9PmfBn7gV0C5IEqvFysZHH0vZafTMBUvwrKPEipaIQ7Rneud4qbKod_TzwfcBUoCnfGFhjPKkJcyzUwRAWp1YzZ7Ci6lY2trJ5-pDJMIv2v6i4M9KABIXmmfGaG--vYePKcmvzXKoygqB_Rc6E3HDzlBvJZfC_chs"
      />
      <button className="mt-8 md:mt-0 relative z-10 bg-surface-container-lowest text-primary px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-white/30 whitespace-nowrap">
        تفعيل التذكير
      </button>
    </div>
  );
}
