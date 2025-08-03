"use client";

import { useEffect, useState } from "react";

import {
	Cloud,
	CloudRain,
	CloudSnow,
	Droplets,
	Eye,
	Gauge,
	MapPin,
	Sun,
	Thermometer,
	Wind,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
		Imperial: {
			Value: number;
			Unit: string;
		};
	};
	WeatherText: string;
	WeatherIcon: number;
	RelativeHumidity: number;
	Wind: {
		Speed: {
			Metric: {
				Value: number;
				Unit: string;
			};
		};
		Direction: {
			Degrees: number;
		};
	};
	ApparentTemperature: {
		Metric: {
			Value: number;
			Unit: string;
		};
	};
	Visibility: {
		Metric: {
			Value: number;
			Unit: string;
		};
	};
	Pressure: {
		Metric: {
			Value: number;
			Unit: string;
		};
	};
	UVIndex: number;
	UVIndexText: string;
}

interface WeatherDetailViewProps {
	city: City;
}

const getWeatherIcon = (weatherText: string) => {
	const text = weatherText.toLowerCase();
	if (text.includes("clear") || text.includes("sunny")) {
		return <Sun className="h-8 w-8 text-yellow-500" />;
	} else if (text.includes("cloud")) {
		return <Cloud className="h-8 w-8 text-gray-500" />;
	} else if (text.includes("rain") || text.includes("drizzle")) {
		return <CloudRain className="h-8 w-8 text-blue-500" />;
	} else if (text.includes("snow")) {
		return <CloudSnow className="h-8 w-8 text-blue-300" />;
	} else {
		return <Wind className="h-8 w-8 text-gray-500" />;
	}
};

export function WeatherDetailView({ city }: WeatherDetailViewProps) {
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
			<div className="p-6 space-y-6">
				<div className="space-y-4">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-16 w-24" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
					{[
						"feels-like",
						"humidity",
						"wind",
						"visibility",
						"pressure",
						"uv-index",
					].map((type) => (
						<Card key={type}>
							<CardHeader className="pb-2">
								<Skeleton className="h-4 w-16" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-12" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (!weather) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center space-y-4">
					<Wind className="h-12 w-12 text-muted-foreground mx-auto" />
					<h2 className="text-xl font-semibold">Weather Unavailable</h2>
					<p className="text-muted-foreground">Unable to load weather data</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 space-y-8 overflow-x-hidden">
			{/* Current Weather Header */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="h-4 w-4" />
					<span>MY LOCATION</span>
				</div>
				<h1 className="text-4xl font-bold">{city.name}</h1>
				<div className="flex items-center gap-6">
					<div>
						<div className="text-7xl font-bold">
							{Math.round(weather.Temperature.Metric.Value)}°
						</div>
						<div className="text-xl text-muted-foreground">
							{weather.WeatherText}
						</div>
					</div>
					{getWeatherIcon(weather.WeatherText)}
				</div>
			</div>

			{/* Weather Banner */}
			<div className="bg-accent/50 rounded-lg p-4">
				<p className="text-sm text-muted-foreground">
					{weather.WeatherText} conditions will continue all day. Wind gusts are
					up to {Math.round(weather.Wind.Speed.Metric.Value * 1.5)}{" "}
					{weather.Wind.Speed.Metric.Unit}.
				</p>
			</div>

			{/* Hourly Forecast */}
			<Card>
				<CardContent className="p-6">
					<div className="flex gap-6 overflow-x-auto">
						{[
							"Now",
							"10AM",
							"11AM",
							"12PM",
							"1PM",
							"2PM",
							"3PM",
							"4PM",
							"5PM",
							"6PM",
							"7PM",
							"8PM",
							"9PM",
							"10PM",
							"11PM",
							"12AM",
						].map((time, index) => (
							<div
								key={time}
								className="flex flex-col items-center gap-2 min-w-[60px]"
							>
								<span className="text-sm text-muted-foreground">{time}</span>
								{getWeatherIcon(weather.WeatherText)}
								<span className="text-lg font-semibold">
									{Math.round(
										weather.Temperature.Metric.Value + (index - 2) * 2,
									)}
									°
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Main Grid Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column */}
				<div className="space-y-6">
					{/* 10-Day Forecast */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">10-DAY FORECAST</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{[
								"Today",
								"Tomorrow",
								"Wed",
								"Thu",
								"Fri",
								"Sat",
								"Sun",
								"Mon",
								"Tue",
							].map((day, index) => (
								<div key={day} className="flex items-center justify-between">
									<span className="text-sm font-medium">{day}</span>
									<div className="flex items-center gap-2">
										{getWeatherIcon(weather.WeatherText)}
										<span className="text-sm">
											{Math.round(weather.Temperature.Metric.Value - 5)}°
										</span>
										<div className="w-16 h-1 bg-accent rounded-full">
											<div className="w-12 h-1 bg-primary rounded-full"></div>
										</div>
										<span className="text-sm">
											{Math.round(weather.Temperature.Metric.Value + 5)}°
										</span>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Air Quality */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Wind className="h-4 w-4" />
								AIR QUALITY
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">62 Moderate</div>
							<div className="w-full h-2 bg-accent rounded-full mt-2">
								<div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								Air quality index is 62, which is similar to yesterday at about
								this time.
							</div>
						</CardContent>
					</Card>

					{/* Wind */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Wind className="h-4 w-4" />
								WIND
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">
								{Math.round(weather.Wind.Speed.Metric.Value)}{" "}
								{weather.Wind.Speed.Metric.Unit}
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								Gusts {Math.round(weather.Wind.Speed.Metric.Value * 1.5)}{" "}
								{weather.Wind.Speed.Metric.Unit} W
							</div>
							<div className="text-xs text-muted-foreground">
								Direction {weather.Wind.Direction?.Degrees || 0}° NNE
							</div>
						</CardContent>
					</Card>

					{/* UV Index */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Sun className="h-4 w-4" />
								UV INDEX
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">4 Moderate</div>
							<div className="w-full h-2 bg-accent rounded-full mt-2">
								<div className="w-1/3 h-2 bg-orange-500 rounded-full"></div>
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								Use sun protection until 6PM.
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Center Column */}
				<div className="space-y-6">
					{/* Precipitation Map */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">PRECIPITATION MAP</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="bg-accent/20 rounded-lg h-48 flex items-center justify-center">
								<div className="text-center">
									<MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
									<div className="text-sm text-muted-foreground">
										Weather Map
									</div>
									<div className="text-xs text-muted-foreground">
										Interactive map coming soon
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Sunset */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Sun className="h-4 w-4" />
								SUNSET
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">8:08PM</div>
							<div className="text-xs text-muted-foreground mt-2">
								Sunrise: 5:56AM
							</div>
						</CardContent>
					</Card>

					{/* Feels Like */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Thermometer className="h-4 w-4" />
								FEELS LIKE
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">
								{Math.round(weather.ApparentTemperature.Metric.Value)}°
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								It feels warmer than the actual temperature.
							</div>
						</CardContent>
					</Card>

					{/* Precipitation */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Droplets className="h-4 w-4" />
								PRECIPITATION
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">0" Today</div>
							<div className="text-xs text-muted-foreground mt-2">
								Next expected is .15" Aug 12.
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Waxing Gibbous */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">WAXING GIBBOUS</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">Illumination 69%</div>
							<div className="text-xs text-muted-foreground mt-2">
								Moonrise 4:03PM
							</div>
							<div className="text-xs text-muted-foreground">
								Next Full Moon 6 DAYS
							</div>
						</CardContent>
					</Card>

					{/* Humidity */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Droplets className="h-4 w-4" />
								HUMIDITY
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">
								{weather.RelativeHumidity}%
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								The dew point is{" "}
								{Math.round(weather.Temperature.Metric.Value - 10)}° right now.
							</div>
						</CardContent>
					</Card>

					{/* Visibility */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Eye className="h-4 w-4" />
								VISIBILITY
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">
								{Math.round(weather.Visibility.Metric.Value)}{" "}
								{weather.Visibility.Metric.Unit}
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								Perfectly clear view.
							</div>
						</CardContent>
					</Card>

					{/* Pressure */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Gauge className="h-4 w-4" />
								PRESSURE
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">
								{Math.round(weather.Pressure.Metric.Value)}{" "}
								{weather.Pressure.Metric.Unit}
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								Normal atmospheric pressure.
							</div>
						</CardContent>
					</Card>

					{/* Averages */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">AVERAGES</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-semibold">
								-1° from average daily high
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								Today H:{Math.round(weather.Temperature.Metric.Value + 5)}°
							</div>
							<div className="text-xs text-muted-foreground">
								Average H:{Math.round(weather.Temperature.Metric.Value + 6)}°
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
