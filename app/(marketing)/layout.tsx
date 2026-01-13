import NavBar from "@/components/lading-page-comps/navBar";
import Container from "@/components/lading-page-comps/Container";
import Footer from "@/components/lading-page-comps/Footer";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col min-h-screen">
			<Container>
				{children}
			</Container>
			<Footer />
		</div>
	);
}
