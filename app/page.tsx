"use client";

import { useState } from "react";
import { Bubbles, Plus } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { CitySearchDialog } from "@/components/city-search-dialog";
import { EmptyState } from "@/components/empty-state";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { WeatherDetailView } from "@/components/weather-detail-view";

interface City {
	name: string;
	country: string;
	lat: number;
	lon: number;
	key: string;
}

export default function Page() {
	const [cities, setCities] = useState<City[]>([]);
	const [selectedCity, setSelectedCity] = useState<City | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleAddCity = (city: City) => {
		// Check if city already exists
		if (!cities.find((c) => c.key === city.key)) {
			const newCities = [...cities, city];
			setCities(newCities);
			// Select the newly added city
			setSelectedCity(city);
		}
	};

	const handleRemoveCity = (cityKey: string) => {
		setCities((prev) => prev.filter((city) => city.key !== cityKey));
		// If we removed the selected city, select the first available city
		if (selectedCity?.key === cityKey) {
			setSelectedCity(cities.length > 1 ? cities[0] : null);
		}
	};

	const handleSelectCity = (city: City) => {
		setSelectedCity(city);
	};

	const handleOpenAddCity = () => {
		setIsDialogOpen(true);
	};

	return (
		<SidebarProvider className="h-screen overflow-hidden">
			<AppSidebar
				cities={cities}
				selectedCity={selectedCity}
				onRemoveCity={handleRemoveCity}
				onSelectCity={handleSelectCity}
			/>
			<SidebarInset className="overflow-x-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<span className="text-lg font-semibold">Weather</span>
					</div>
					<div className="flex items-center">
						<CitySearchDialog
							onAddCity={handleAddCity}
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}
						/>
					</div>
				</header>
				<div className="flex flex-1 flex-col overflow-hidden overflow-x-hidden">
					{selectedCity ? (
						<WeatherDetailView city={selectedCity} />
					) : (
						<EmptyState
							icon={Bubbles}
							title="Welcome to Weather"
							description="Add a city to get started and view detailed weather information"
							actionLabel="Add city"
							onAction={handleOpenAddCity}
							buttonIcon={Plus}
						/>
					)}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
