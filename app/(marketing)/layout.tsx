import NavBar from "@/components/lading-page-comps/navBar";
import Container from "@/components/lading-page-comps/Container";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NavBar />
			<Container>
				{children}
			</Container>
		</>
	);
}
