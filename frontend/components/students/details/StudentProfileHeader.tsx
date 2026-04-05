import Image from "next/image";

interface StudentProfileHeaderProps {
  student: {
    id: string;
    name: string;
    group: string;
    avatar?: string;
    initials?: string;
  };
}

export default function StudentProfileHeader({ student }: StudentProfileHeaderProps) {
  return (
    <section className="relative">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_32px_rgba(25,28,29,0.04)] flex flex-col items-center text-center">
        {student.avatar ? (
          <div className="w-24 h-24 rounded-full mb-4 overflow-hidden relative shrink-0">
            <Image
              src={student.avatar}
              alt={student.name}
              fill
              sizes="96px"
              className="object-cover"
              suppressHydrationWarning
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-primary-fixed rounded-full mb-4 flex items-center justify-center shrink-0">
            {student.initials ? (
              <span className="text-primary font-bold text-3xl font-headline">
                {student.initials}
              </span>
            ) : (
              <span 
                className="material-symbols-outlined text-primary text-5xl" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            )}
          </div>
        )}

        <h2 className="title-md text-on-surface mb-1 font-headline font-bold">{student.name}</h2>
        <span className="text-primary font-medium mb-4 block text-sm">{student.group}</span>
        
        <div className="w-full flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm">call</span>
            <span className="text-on-surface-variant font-label text-sm">التواصل مع ولي الأمر</span>
          </div>
        </div>
      </div>
    </section>
  );
}
