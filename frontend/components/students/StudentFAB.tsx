export default function StudentFAB() {
  return (
    <button className="fixed bottom-32 left-8 bg-primary text-on-primary w-16 h-16 rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform duration-200 z-40 group hover:shadow-2xl">
      <span className="material-symbols-outlined text-3xl">person_add</span>
      <span className="absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
        إضافة طالب جديد
      </span>
    </button>
  );
}
