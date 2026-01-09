"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LocationAutocomplete({ onSelect }: { onSelect: (location: any) => void }) {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	// Debounce query to avoid rapid API calls (300ms is standard for search)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);
		return () => clearTimeout(handler);
	}, [query]);

	const { isFetching, isError, data, error } = useQuery({
		queryKey: ['locationSearch', debouncedQuery],
		queryFn: async () => {
			if (!debouncedQuery || debouncedQuery.length <= 2) return [];

			// Fetching directly from the client for maximum speed and to avoid server action overhead
			const resp = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
			
			const results = (resp.data.features || []).map((f: any) => ({
				place_id: f.properties.osm_id || Math.random(),
				display_name: [f.properties.name, f.properties.city, f.properties.country].filter(Boolean).join(", "),
				lat: f.geometry.coordinates[1],
				lon: f.geometry.coordinates[0]
			}));

			return results;
		},
		enabled: debouncedQuery.length > 2,
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	})

	const results = Array.isArray(data) ? data : [];

	return (
		<div className="relative w-full max-w-[300px] text-black">
			<div className="relative flex items-center">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search city..."
					className="w-full border-2 border-gray-100 p-2.5 pr-10 bg-white text-black rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
				/>
				{isFetching && (
					<div className="absolute right-3">
						<div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
					</div>
				)}
			</div>

			{/* Results Dropdown */}
			{results.length > 0 && (
				<div className="absolute top-full left-0 right-0 z-[999] mt-1 shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white">
					<ul className="max-h-60 overflow-y-auto">
						{results.map((place: any) => (
							<li
								key={place.place_id}
								onClick={() => {
									onSelect({
										lat: place.lat,
										lng: place.lon,
										name: place.display_name
									});
									setQuery(place.display_name);
								}}
								className="p-3 cursor-pointer hover:bg-blue-50 text-sm text-gray-800 border-b border-gray-50 last:border-b-0 transition-colors"
							>
								{place.display_name}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Empty/Error States */}
			{!isFetching && debouncedQuery.length > 2 && results.length === 0 && (
				<div className="absolute top-full left-0 right-0 z-[999] mt-1 p-4 bg-white border border-gray-200 rounded-lg shadow-xl text-center">
					<p className="text-xs text-gray-500 italic">
						{isError ? "Unable to reach search service" : `No results for "${debouncedQuery}"`}
					</p>
				</div>
			)}
		</div>
	);
}
