"use client";

import { useState } from "react";
import DashboardNavBar from "@/components/dashboard-comps/DashboardNavBar";
import Container from "@/components/lading-page-comps/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Initialize QueryClient once and keep it stable across re-renders
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen bg-gray-50/50">
				<DashboardNavBar />
				<main>

					<div className="h-full">{children}</div>

				</main>
				<Toaster richColors position="top-center" />
			</div>
		</QueryClientProvider>
	);
}
