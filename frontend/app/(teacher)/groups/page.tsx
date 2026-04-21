import { Group, groupsService } from "@/services/api/groups";
import { GroupCard } from "@/components/groups/group-card";
import Link from "next/link";

export default async function GroupsPage() {
	let paginatedGroups;
	let error = null;

	try {
		paginatedGroups = await groupsService.fetchGroups();
		console.log(paginatedGroups);
	} catch (err: unknown) {
		const errorObj = err as Error;
		error = errorObj.message || "Failed to fetch groups";
	}

	return (
		<main className="p-4 max-w-xl mx-auto rtl pb-20">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					المجموعات التعليمية
				</h1>
				<Link
					href="/groups/new"
					className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
				>
					+ إضافة مجموعة
				</Link>
			</div>

			{error ? (
				<div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm text-center">
					{error}
				</div>
			) : (
				<div className="space-y-4">
					{paginatedGroups?.data?.items &&
					paginatedGroups.data.items.length > 0 ? (
						paginatedGroups.data.items.map((group: Group) => (
							<Link
								href={`/groups/${group.id}`}
								key={group.id}
								className="block"
							>
								<GroupCard group={group} />
							</Link>
						))
					) : (
						<div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
							<span className="material-symbols-outlined text-4xl mb-2 text-gray-300">
								event_busy
							</span>
							<p>لا توجد مجموعات حتى الآن.</p>
							<p className="text-xs text-gray-400 mt-1">
								اضغط على إضافة مجموعة للبدء
							</p>
						</div>
					)}
				</div>
			)}
		</main>
	);
}
