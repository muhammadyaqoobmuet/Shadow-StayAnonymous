import type { Metadata } from "next";
import DashboardClientLayout from "./DashboardClientLayout";

export const metadata: Metadata = {
	title: "Shadow",
	description: "A secure, location-based anonymous chat application.",
	openGraph: {
		images: ["/ogimage.png"],
	},
	icons: {
		icon: "/ghost.svg",
	},
};

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
