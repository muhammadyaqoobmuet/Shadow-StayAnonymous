'use server'

import axios from "axios";

export const searchLocations = async (query: string) => {
	if (!query) return [];
	try {
		console.log(`[SERVER] Searching for: "${query}"`);
		// Switching to Photon API for better speed and fewer rate-limiting issues
		const resp = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`, {
			timeout: 5000
		})

		// Map Photon GeoJSON to a simpler format
		const features = resp.data?.features || [];
		const results = features.map((f: any) => ({
			place_id: f.properties.osm_id || Math.random(),
			display_name: [f.properties.name, f.properties.city, f.properties.country].filter(Boolean).join(", "),
			lat: f.geometry.coordinates[1],
			lon: f.geometry.coordinates[0]
		}));

		console.log(`[SERVER] Found ${results.length} results for "${query}"`);
		return results;
	} catch (error: any) {
		console.error("[SERVER] Location search error:", error.response?.data || error.message);
		throw error;
	}
};
