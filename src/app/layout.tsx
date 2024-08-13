import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";

import "./globals.css";
import "./variables.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Sceach",
	description:
		"We're revolutionising the monitoring and detection of illegal hedge cutting in Ireland",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="google-site-verification"
					content="Rx6My6qt_Plf7QSo8PCH7zTc-6BC8izv6NlUNnE86yw"
				/>
			</head>
			<body className={inter.className}>
				<Header />

				{children}
			</body>
		</html>
	);
}
