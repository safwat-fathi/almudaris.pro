import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "المدرس برو",
		template: "%s | المدرس برو",
	},
	description: "منصة التعليم الذكي لإدارة الحصص والطلاب والمدفوعات",
	applicationName: "المدرس برو",
	keywords: ["تعليم", "طلاب", "حصص", "مدرس", "إدارة"],
	authors: [{ name: "Al-Mudaris Pro" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ar" dir="rtl" className="h-full antialiased">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="font-body bg-surface text-on-surface min-h-full flex flex-col pb-8">
				{children}
			</body>
		</html>
	);
}
