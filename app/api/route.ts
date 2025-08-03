import { type NextRequest, NextResponse } from "next/server";

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const BASE_URL = "http://dataservice.accuweather.com";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const location = searchParams.get("location");
	const type = searchParams.get("type"); // 'current', 'forecast'

	if (!ACCUWEATHER_API_KEY) {
		return NextResponse.json(
			{ error: "AccuWeather API key not configured" },
			{ status: 500 },
		);
	}

	try {
		switch (type) {
			case "current":
				return await getCurrentConditions(location);
			case "forecast":
				return await getForecast(location);
			default:
				return NextResponse.json(
					{ error: "Invalid request type" },
					{ status: 400 },
				);
		}
	} catch (error) {
		console.error("Weather API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch weather data" },
			{ status: 500 },
		);
	}
}

async function getCurrentConditions(locationKey: string | null) {
	if (!locationKey) {
		return NextResponse.json(
			{ error: "Location key required" },
			{ status: 400 },
		);
	}

	const response = await fetch(
		`${BASE_URL}/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch current conditions");
	}

	const data = await response.json();
	return NextResponse.json(data[0]);
}

async function getForecast(locationKey: string | null) {
	if (!locationKey) {
		return NextResponse.json(
			{ error: "Location key required" },
			{ status: 400 },
		);
	}

	// Get 5-day forecast
	const response = await fetch(
		`${BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true&metric=false`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch forecast");
	}

	const data = await response.json();
	return NextResponse.json(data);
}
