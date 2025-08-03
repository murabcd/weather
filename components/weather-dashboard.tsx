"use client";

import { useEffect, useState } from "react";

import {
	Cloud,
	CloudRain,
	Droplets,
	Eye,
	Gauge,
	Moon,
	Sun,
	Sunrise,
	Thermometer,
	Wind,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

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

interface WeatherDashboardProps {
	city: City;
}

export function WeatherDashboard({ city }: WeatherDashboardProps) {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [hourly, setHourly] = useState<any[] | null>(null);
	const [daily, setDaily] = useState<any | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [astro, setAstro] = useState<{ sun: any; moon: any } | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				setLoading(true);
				setError(null);
				const [cur, hr, dy] = await Promise.all([
					fetch(`/api?location=${city.key}&type=current`),
					fetch(`/api?location=${city.key}&type=hourly`),
					fetch(`/api?location=${city.key}&type=daily`),
				]);
				if (!cur.ok || !hr.ok || !dy.ok) throw new Error("api");
				setWeather(await cur.json());
				setHourly(await hr.json());
				setDaily(await dy.json());
				setAstro(null);
			} catch (e) {
				setError("Failed to load weather");
				setWeather(null);
				setHourly(null);
				setDaily(null);
				setAstro(null);
			} finally {
				setLoading(false);
			}
		};
		fetchWeather();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [city.key]);

	if (loading) {
		return (
			<div className="bg-background text-foreground">
				<div className="p-6 space-y-6">
					<div className="text-center space-y-4">
						<Skeleton className="h-8 w-32 mx-auto" />
						<Skeleton className="h-16 w-24 mx-auto" />
						<Skeleton className="h-4 w-48 mx-auto" />
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{[
							"feels-like",
							"humidity",
							"wind",
							"visibility",
							"pressure",
							"uv-index",
						].map((type) => (
							<div key={type} className="bg-card rounded-xl p-4">
								<Skeleton className="h-4 w-16 mb-2" />
								<Skeleton className="h-8 w-12" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!weather) {
		return (
			<EmptyState
				icon={Wind}
				title="Weather unavailable"
				description="Unable to load weather data for this location. Please try again later."
				actionLabel="Retry"
				onAction={() => window.location.reload()}
				isLoading={loading}
			/>
		);
	}

	return (
		<div className="bg-background text-foreground">
			<div className="p-6 pt-16 space-y-4">
				{/* Current Weather Header */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
					<div className="space-y-2">
						<div className="space-y-1">
							<h1 className="text-lg font-medium">{city.name}</h1>
							<div className="text-4xl font-thin">
								{Math.round(weather.Temperature.Metric.Value)}°
							</div>
							<div className="text-sm text-muted-foreground">
								{weather.WeatherText}
							</div>
							<div className="text-xs text-muted-foreground">
								H:{Math.round(weather.Temperature.Metric.Value + 6)}° L:
								{Math.round(weather.Temperature.Metric.Value - 8)}°
							</div>
						</div>

						{/* Weather Banner */}
						<div className="rounded-xl py-2">
							<p className="text-xs text-muted-foreground">
								{weather.WeatherText} conditions expected tomorrow.
							</p>
						</div>
					</div>

					{/* Hourly Forecast */}
					<Card>
						<CardContent className="p-2">
							<div className="flex gap-4 overflow-x-auto pb-2">
								{(hourly ?? []).map((h, idx) => {
									const dt = new Date(h.DateTime ?? h.EpochDateTime * 1000);
									const label = dt.toLocaleTimeString(undefined, {
										hour: "numeric",
									});
									const temp = Math.round(
										h.Temperature?.Value ?? h.Temperature?.Metric?.Value ?? 0,
									);
									return (
										<div
											key={`${dt.getTime()}-${idx}`}
											className="flex flex-col items-center gap-2 min-w-[50px] text-center"
										>
											<span className="text-xs text-muted-foreground">
												{label}
											</span>
											<Cloud className="h-5 w-5 text-muted-foreground" />
											<span className="text-xs font-medium">{temp}°</span>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Left Column - 5-Day Forecast */}
					<div className="space-y-4 h-full">
						{/* 10-Day Forecast */}
						<Card className="h-full">
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-4">
									<Droplets className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										5-DAY FORECAST
									</span>
								</div>
								<div className="space-y-3">
									{(daily?.DailyForecasts ?? []).map((d: any, idx: number) => {
										const date = new Date(d.Date);
										const day = date.toLocaleDateString(undefined, {
											weekday: "short",
										});
										const low = Math.round(d.Temperature.Minimum.Value);
										const high = Math.round(d.Temperature.Maximum.Value);
										const rain = d.Day?.PrecipitationProbability
											? `${d.Day.PrecipitationProbability}%`
											: null;
										const IconComponent = d.Day?.HasPrecipitation
											? CloudRain
											: d.Day?.Icon === 1
												? Sun
												: Cloud;
										return (
											<div
												key={`${date.getTime()}-${idx}`}
												className="flex items-center justify-between py-1"
											>
												<div className="flex items-center gap-3 flex-1">
													<span className="text-xs font-medium w-12">
														{day}
													</span>
													<IconComponent className="h-4 w-4 text-muted-foreground" />
													{rain && (
														<span className="text-xs text-muted-foreground">
															{rain}
														</span>
													)}
												</div>
												<div className="flex items-center gap-2">
													<span className="text-xs text-muted-foreground w-6 text-right">
														{low}°
													</span>
													<div className="w-16 h-1 bg-slate-600 rounded-full">
														<div
															className="h-1 bg-primary rounded-full"
															style={{
																width: `${Math.min(
																	100,
																	Math.max(0, ((high - low) / 20) * 100),
																)}%`,
															}}
														></div>
													</div>
													<span className="text-xs w-6">{high}°</span>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - All Other Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* UV Index */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Sun className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										UV INDEX
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">0</div>
									<div className="text-xs text-slate-400">Low</div>
									<div className="w-full h-1 bg-slate-600 rounded-full">
										<div className="w-0 h-1 bg-green-500 rounded-full"></div>
									</div>
									<div className="text-xs text-slate-400">
										Low for the rest of the day.
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Sunrise */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Sunrise className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										SUNRISE
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">4:40AM</div>
									<div className="text-xs text-slate-400">Sunset: 8:29PM</div>
								</div>
							</CardContent>
						</Card>

						{/* Wind */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Wind className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										WIND
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">N</div>
									<div className="text-sm">
										{Math.round(weather.Wind.Speed.Metric.Value)} mph
									</div>
									<div className="text-xs text-slate-400">
										Gusts: {Math.round(weather.Wind.Speed.Metric.Value * 1.2)}{" "}
										mph NNE
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Waxing Gibbous */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Moon className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										WAXING GIBBOUS
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<div className="text-2xl font-light">🌔</div>
										<div className="text-xs text-slate-400">
											Moonset: 10:45PM
										</div>
										<div className="text-xs text-slate-400">
											1° expected tomorrow.
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Visibility */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Eye className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										VISIBILITY
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">15 mi</div>
									<div className="text-xs text-slate-400">
										Perfectly clear view.
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Pressure */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Gauge className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										PRESSURE
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light flex items-center">
										<Gauge className="h-6 w-6 mr-2" />
										<span>30.06</span>
									</div>
									<div className="text-xs">inHg</div>
									<div className="flex justify-between text-xs text-slate-400">
										<span>Low</span>
										<span>High</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Feels Like */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Thermometer className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										FEELS LIKE
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">21°</div>
									<div className="text-xs text-slate-400">
										Similar to the actual temperature.
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Humidity */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Droplets className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										HUMIDITY
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">77%</div>
									<div className="text-xs text-slate-400">
										The dew point is 17° right now.
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Averages */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<Thermometer className="h-3 w-3 text-slate-400" />
									<span className="text-xs text-slate-400 uppercase tracking-wide">
										AVERAGES
									</span>
								</div>
								<div className="space-y-2">
									<div className="text-2xl font-light">+4°</div>
									<div className="text-xs text-muted-foreground">
										above average daily high
									</div>
									<div className="text-xs text-slate-400 space-y-1">
										<div>Today H:27° L:17°</div>
										<div>Average H:23°</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
