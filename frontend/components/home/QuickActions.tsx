import { mockQuickActions } from "@/data/mockData";
import Link from "next/link";

export default function QuickActions() {
  return (
		<section className="space-y-4">
			<h2 className="text-xl font-headline font-bold text-on-surface">
				إجراءات سريعة
			</h2>
			<div className="grid grid-cols-2 gap-4">
				{mockQuickActions.map(action => (
					<Link
						key={action.id}
						href={action.href}
						className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow active:scale-95"
					>
						<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
							<span className="material-symbols-outlined text-primary text-3xl">
								{action.icon}
							</span>
						</div>
						<span className="font-headline font-bold text-sm">
							{action.label}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
