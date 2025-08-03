"use client";

import { useEffect, useState } from "react";

import { MapPin, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface City {
	name: string;
	country: string;
	lat: number;
	lon: number;
	key: string;
}

interface WeatherData {
	Temperature: {
		Metric: {
			Value: number;
			Unit: string;
		};
	};
	WeatherText: string;
}

interface ListItemProps {
	city: City;
	isSelected: boolean;
	onSelect: () => void;
	onRemove: () => void;
}

export function ListItem({
	city,
	isSelected,
	onSelect,
	onRemove,
}: ListItemProps) {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api?location=${city.key}&type=current`);

				if (response.ok) {
					const data = await response.json();
					setWeather(data);
				}
			} catch (error) {
				console.error("Error fetching weather:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWeather();
	}, [city.key]);

	if (loading) {
		return (
			<Card
				className={`cursor-pointer transition-colors ${isSelected ? "bg-accent" : "hover:bg-accent/50"}`}
			>
				<CardContent className="p-3">
					<div className="flex items-center justify-between">
						<div className="flex-1">
							<Skeleton className="h-4 w-20 mb-1" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="h-6 w-8" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={`cursor-pointer transition-colors border ${isSelected ? "bg-primary/10 border-primary/20" : "bg-card hover:bg-accent/50 border-border"}`}
			onClick={onSelect}
		>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-1 mb-1">
							<MapPin className="h-3 w-3 text-muted-foreground" />
							<span className="text-sm font-medium truncate">{city.name}</span>
						</div>
						{weather && (
							<div className="text-xs text-muted-foreground">
								{weather.WeatherText}
							</div>
						)}
					</div>
					<div className="flex items-center gap-2">
						{weather && (
							<span className="text-sm font-semibold">
								{Math.round(weather.Temperature.Metric.Value)}°
							</span>
						)}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							className="text-muted-foreground hover:text-foreground p-1 rounded-sm"
						>
							<X className="h-3 w-3" />
						</button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
