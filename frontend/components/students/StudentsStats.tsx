import { mockStats } from "@/data/mockData";
import { formatNumber, formatPercentage } from "@/lib/format";

type Props = {
	studentsCount: number;
	collectionRate: number;
	activeSessions: number;
};

export default function StudentsStats({
	studentsCount,
	collectionRate,
	activeSessions,
}: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
			<div className="bg-primary-container p-6 rounded-xl text-on-primary-container flex flex-col justify-between h-40 shadow-sm">
				<span className="text-sm font-medium opacity-90">إجمالي الطلاب</span>
				<div className="flex items-baseline gap-2">
					<span className="text-5xl font-bold font-headline">
						{formatNumber(studentsCount)}
					</span>
					<span className="text-sm">طالب نشط</span>
				</div>
			</div>
			<div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between h-40">
				<span className="text-sm font-medium text-on-surface-variant">
					نسبة التحصيل
				</span>
				<div className="flex items-baseline gap-2">
					<span className="text-5xl font-bold font-headline text-secondary">
						{formatPercentage(mockStats.collectionRate)}
					</span>
					<span className="text-sm text-secondary">لهذا الشهر</span>
				</div>
			</div>
			<div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between h-40">
				<span className="text-sm font-medium text-on-surface-variant">
					مجموعات اليوم
				</span>
				<div className="flex items-baseline gap-2">
					<span className="text-5xl font-bold font-headline text-primary">
						{formatNumber(mockStats.activeSessions, {
							minimumIntegerDigits: 2,
						})}
					</span>
					<span className="text-sm text-primary">جلسات متبقية</span>
				</div>
			</div>
		</div>
	);
}
