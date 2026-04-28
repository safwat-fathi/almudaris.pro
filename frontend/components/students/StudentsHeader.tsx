import Link from "next/link";

export default function StudentsHeader() {
  return (
		<header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-2">
					الطلاب
				</h2>
				<p className="text-on-surface-variant font-body text-lg">
					إدارة قائمة الطلاب والمشاركين في دوراتك الأكاديمية
				</p>
			</div>
			{/* <Link 
        href="/students/invite" 
        className="flex items-center justify-center gap-2 bg-primary text-on-primary h-14 px-8 rounded-lg shadow-[0_8px_24px_rgba(26,115,232,0.25)] hover:shadow-[0_12px_32px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all w-full md:w-auto"
      >
        <span className="material-symbols-outlined shrink-0 text-xl">person_add</span>
        <span className="font-bold">دعوة طالب</span>
      </Link> */}
		</header>
	);
}
