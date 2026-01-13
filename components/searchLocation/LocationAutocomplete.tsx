"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Loader2, MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LocationAutocomplete({ onSelectAction }: { onSelectAction: (location: any) => void }) {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);
		return () => clearTimeout(handler);
	}, [query]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const { isFetching, isError, data } = useQuery({
		queryKey: ['locationSearch', debouncedQuery],
		queryFn: async () => {
			if (!debouncedQuery || debouncedQuery.length <= 2) return [];

			const resp = await axios.get(`${process.env.NEXT_PUBLIC_GEO_API_URL || 'https://photon.komoot.io/api'}/?q=${encodeURIComponent(debouncedQuery)}&limit=5`);

			const results = (resp.data.features || []).map((f: any) => ({
				place_id: f.properties.osm_id || Math.random(),
				display_name: [f.properties.name, f.properties.city, f.properties.country].filter(Boolean).join(", "),
				lat: f.geometry.coordinates[1],
				lon: f.geometry.coordinates[0]
			}));

			return results;
		},
		enabled: debouncedQuery.length > 2,
		staleTime: 1000 * 60 * 5,
	});

	const results = Array.isArray(data) ? data : [];

	return (
		<div className="relative w-full overflow-visible" ref={containerRef}>
			<div className="relative flex items-center group">
				<Search className="absolute left-3 text-muted-foreground group-focus-within:text-foreground transition-colors" size={14} />
				<input
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder="Jump to coordinates..."
					className="w-full bg-background border border-border py-3 pl-10 pr-10 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-all font-mono uppercase tracking-tight shadow-inner"
				/>
				{isFetching && (
					<div className="absolute right-3">
						<Loader2 className="animate-spin h-3 w-3 text-accent" />
					</div>
				)}
			</div>

			{/* Results Dropdown */}
			<AnimatePresence>
				{isOpen && (results.length > 0 || (debouncedQuery.length > 2 && !isFetching)) && (
					<motion.div
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 5 }}
						className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface border border-border shadow-2xl overflow-hidden"
					>
						<div className="px-3 py-2 border-b border-border font-bold bg-primary text-primary-foreground">
							<span className="text-[10px] font-mono uppercase tracking-[0.2em]">Select Frequency Vector</span>
						</div>
						<ul className="max-h-80 overflow-y-auto custom-scrollbar bg-background">
							{results.map((place: any, index: number) => (
								<li
									key={`${place.place_id}-${index}`}
									onClick={() => {
										onSelectAction({
											lat: place.lat,
											lng: place.lon,
											name: place.display_name
										});
										setQuery(place.display_name);
										setIsOpen(false);
									}}
									className="p-4 cursor-pointer hover:bg-primary/5 group border-b border-border/50 last:border-b-0 transition-all flex items-start gap-4"
								>
									<div className="bg-surface p-2 border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
										<MapPin size={14} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-[11px] font-mono font-bold text-foreground uppercase truncate tracking-tight mb-1">
											{place.display_name.split(',')[0]}
										</p>
										<p className="text-[9px] font-mono text-muted-foreground uppercase truncate opacity-70">
											{place.display_name.split(',').slice(1).join(',').trim()}
										</p>
									</div>
								</li>
							))}

							{!isFetching && results.length === 0 && debouncedQuery.length > 2 && (
								<li className="p-4 text-center">
									<p className="text-[10px] text-zinc-600 font-mono italic uppercase">
										{isError ? "Transmission Error" : `No Vectors Found`}
									</p>
								</li>
							)}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
