"use client";

import { Github, Globe, Linkedin, Twitter, ArrowUpRight, Ghost } from "lucide-react";
import Link from "next/link";

const Footer = () => {
	const links = [
		{
			name: "Portfolio",
			url: "https://yaqoobhalepoto.engineer/",
			icon: <Globe size={16} />,
			handle: "yaqoobhalepoto.engineer"
		},
		{
			name: "GitHub",
			url: "https://github.com/muhammadyaqoobmuet",
			icon: <Github size={16} />,
			handle: "@muhammadyaqoobmuet"
		},
		{
			name: "LinkedIn",
			url: "https://www.linkedin.com/in/yaqoob-halepoto/",
			icon: <Linkedin size={16} />,
			handle: "in/yaqoob-halepoto"
		},
		{
			name: "X (Twitter)",
			url: "https://x.com/jackub_halepoto",
			icon: <Twitter size={16} />,
			handle: "@jackub_halepoto"
		},
	];

	return (
		<footer className="w-full border-t border-border bg-background relative z-40 mt-auto">
			<div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-[0.02] pointer-events-none" />

			<div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16 relative">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-12">
					{/* Brand Column */}
					<div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-4">
						<div className="flex items-center gap-2 font-bold tracking-tight select-none mb-2">
							<div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
								<Ghost size={18} fill="currentColor" />
							</div>
							<span className="text-foreground text-xl">SHADOW</span>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
							Anonymous proximity chat for the modern web. Built with privacy as an architecture, not a feature.
						</p>
					</div>

					{/* Links Column */}
					<div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
						{links.map((link) => (
							<Link
								key={link.name}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex flex-col space-y-2"
							>
								<div className="flex items-center gap-2 text-foreground font-mono text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
									{link.icon}
									<span>{link.name}</span>
									<ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
								</div>
								<span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors truncate">
									{link.handle}
								</span>
							</Link>
						))}
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
						<span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
							Developed by <span className="text-foreground font-bold">Yaqoob Halepoto</span>
						</span>
						<span className="hidden md:inline text-border">|</span>
						<span className="text-[10px] text-muted-foreground/50 font-mono">
							FULL STACK ENGINEER
						</span>
					</div>

					<div className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
						© {new Date().getFullYear()} Shadow Inc.
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
