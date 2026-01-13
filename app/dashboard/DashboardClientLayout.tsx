"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavBar from "@/components/dashboard-comps/DashboardNavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function DashboardClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Initialize QueryClient once and keep it stable across re-renders
	const [queryClient] = useState(() => new QueryClient());
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/");
		}
	}, [router]);

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<div className="min-h-screen bg-background relative selection:bg-white selection:text-black">
					<div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-[0.03] pointer-events-none" />
					<DashboardNavBar />
					<main className="relative z-10">
						<div className="h-[calc(100vh-3.5rem)]">{children}</div>
					</main>
				</div>

				<Toaster richColors position="top-center" />
			</QueryClientProvider>
		</>
	);
}
