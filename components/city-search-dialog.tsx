"use client";

import { useState } from "react";

import { AlertCircle, MapPin, Search, Plus } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface City {
	name: string;
	country: string;
	lat: number;
	lon: number;
	key: string;
}

interface CitySearchDialogProps {
	onAddCity: (city: City) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function CitySearchDialog({
	onAddCity,
	open,
	onOpenChange,
}: CitySearchDialogProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<City[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [internalOpen, setInternalOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Use controlled state if provided, otherwise use internal state
	const isOpen = open !== undefined ? open : internalOpen;
	const setIsOpen = onOpenChange || setInternalOpen;

	const searchCities = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			setError(null);
			return;
		}

		setIsSearching(true);
		setError(null);
		try {
			// Using your API route to search for cities
			const response = await fetch(
				`/api/search?q=${encodeURIComponent(query)}`,
			);

			if (response.ok) {
				const data = await response.json();
				const cities: City[] = data.slice(0, 5).map((item: any) => ({
					name: item.LocalizedName,
					country: item.Country.LocalizedName,
					lat: item.GeoPosition.Latitude,
					lon: item.GeoPosition.Longitude,
					key: item.Key, // AccuWeather location key
				}));
				setSearchResults(cities);
			} else {
				const errorData = await response.json();
				setError(errorData.error || "Failed to search cities");
				setSearchResults([]);
			}
		} catch (error) {
			console.error("Error searching cities:", error);
			setError("Network error. Please check your connection and try again.");
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		searchCities(searchQuery);
	};

	const handleAddCity = (city: City) => {
		onAddCity(city);
		setIsOpen(false);
		setSearchQuery("");
		setSearchResults([]);
		setError(null);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="cursor-pointer">
					<Plus className="h-4 w-4 mr-2" />
					Add city
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add new city</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSearch} className="space-y-4">
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search for a city..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Button type="submit" disabled={isSearching || !searchQuery.trim()}>
							{isSearching ? "Searching..." : "Search"}
						</Button>
					</div>
				</form>

				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{searchResults.length > 0 && (
					<div className="space-y-2">
						<h3 className="text-sm font-medium">Search Results</h3>
						<div className="space-y-1">
							{searchResults.map((city, index) => (
								<Button
									key={`${city.name}-${city.country}-${index}`}
									variant="ghost"
									className="w-full justify-start"
									onClick={() => handleAddCity(city)}
								>
									<MapPin className="mr-2 h-4 w-4" />
									{city.name}, {city.country}
								</Button>
							))}
						</div>
					</div>
				)}

				{searchQuery &&
					searchResults.length === 0 &&
					!isSearching &&
					!error && (
						<p className="text-sm text-muted-foreground text-center py-4">
							No cities found. Try a different search term.
						</p>
					)}
			</DialogContent>
		</Dialog>
	);
}
