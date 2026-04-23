import Link from "next/link";

interface ComingSoonProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export default function ComingSoon({
	title = "هذه الميزة ستكون متاحة قريبًا",
	description = "نحن نعمل بجد لتوفير أفضل تجربة لك. شكراً لصبرك وانضمامك لمجتمع Al-Mudaris Pro.",
	backHref = "/",
	backLabel = "العودة للرئيسية",
}: ComingSoonProps) {
	return (
		<main className="grow flex flex-col items-center justify-center px-8 pt-10 pb-10 max-w-lg mx-auto text-center">
			{/* Illustration Section (Bento-style single large card) */}
			<div className="relative w-full aspect-square mb-10 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
				{/* Background Decorative Elements */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl"></div>
					<div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-primary-container blur-3xl"></div>
				</div>
				{/* Construction/Loading Visual */}
				<div className="relative z-10 flex flex-col items-center">
					<div className="w-48 h-48 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center mb-6">
						<span
							className="material-symbols-outlined text-primary"
							style={{ fontSize: "100px", fontVariationSettings: "'FILL' 1" }}
						>
							construction
						</span>
					</div>
					{/* Progress indicator mimicking a premium loading state */}
					<div className="flex gap-2">
						<div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
						<div className="w-3 h-3 rounded-full bg-primary/40"></div>
						<div className="w-3 h-3 rounded-full bg-primary/20"></div>
					</div>
				</div>
			</div>
			{/* Typography Content */}
			<div className="space-y-6">
				<h2 className="text-3xl font-extrabold tracking-tight text-on-surface leading-tight font-manrope">
					{title}
				</h2>
				<p className="text-on-surface-variant text-lg leading-relaxed max-w-sm mx-auto">
					{description}
				</p>
			</div>
			{/* Primary Action */}
			<div className="mt-12 w-full">
				<Link
					href={backHref}
					className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-lg shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
				>
					<span>{backLabel}</span>
					<span className="material-symbols-outlined">home</span>
				</Link>
			</div>
			{/* Editorial "Signature Texture" Branding */}
			<div className="mt-16 opacity-30 select-none">
				<div className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant flex items-center gap-4 justify-center">
					<span className="h-px w-8 bg-on-surface-variant"></span>
					Al-Mudaris Pro
					<span className="h-px w-8 bg-on-surface-variant"></span>
				</div>
			</div>
		</main>
	);
}
