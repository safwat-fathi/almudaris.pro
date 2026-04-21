import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginSelectionPage() {
	return (
		<div className="flex flex-col items-center w-full min-h-screen pt-4">
			{/* Brand Header Section */}
			<header className="w-full max-w-md px-8 pt-12 pb-8 flex flex-col items-center text-center">
				<div className="mb-6 w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
					<span
						className="material-symbols-outlined text-on-primary text-4xl"
						style={{ fontVariationSettings: "'FILL' 1" }}
					>
						school
					</span>
				</div>
				<h1 className="font-manrope text-3xl font-extrabold tracking-tight text-primary mb-2">
					Al-Mudaris Pro
				</h1>
				<p className="text-on-surface-variant font-medium text-lg leading-relaxed">
					أهلاً بك في منصة التعليم الذكي
				</p>
			</header>

			<main className="w-full max-w-md px-6 flex flex-col gap-10 pb-20 z-10">
				<Suspense
					fallback={
						<div className="h-96 animate-pulse bg-surface-container-low rounded-xl w-full"></div>
					}
				>
					<LoginForm />
				</Suspense>
			</main>

			{/* Decorative Element (The Silent Mentor aesthetic) */}
			<div className="fixed bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
			<div className="fixed top-0 left-0 w-64 h-64 -mt-32 -ml-32 bg-secondary/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
		</div>
	);
}
