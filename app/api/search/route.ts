import { type NextRequest, NextResponse } from "next/server";

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const BASE_URL = "http://dataservice.accuweather.com";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");

	console.log("🔍 Search request received:", { query });

	if (!ACCUWEATHER_API_KEY) {
		console.error("❌ AccuWeather API key not configured");
		return NextResponse.json(
			{ error: "AccuWeather API key not configured" },
			{ status: 500 },
		);
	}

	console.log("✅ API key found:", ACCUWEATHER_API_KEY ? "Present" : "Missing");

	if (!query) {
		console.error("❌ Query parameter missing");
		return NextResponse.json(
			{ error: "Query parameter required" },
			{ status: 400 },
		);
	}

	try {
		const url = `${BASE_URL}/locations/v1/cities/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(query)}&language=en-us&details=false&topLevel=1`;
		console.log("🌐 Making request to:", url);

		const response = await fetch(url);

		console.log("📡 Response status:", response.status);
		console.log("📡 Response status text:", response.statusText);
		console.log(
			"📡 Response headers:",
			Object.fromEntries(response.headers.entries()),
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ API response not ok:", {
				status: response.status,
				statusText: response.statusText,
				errorText: errorText,
			});

			// Handle specific error cases
			if (response.status === 503) {
				return NextResponse.json(
					{
						error: "API rate limit exceeded. Please try again later.",
						details:
							"The AccuWeather API has exceeded the allowed number of requests.",
					},
					{ status: 429 },
				);
			}

			if (response.status === 401) {
				return NextResponse.json(
					{
						error:
							"Invalid API key. Please check your AccuWeather API configuration.",
						details: "The provided API key is not valid or has expired.",
					},
					{ status: 401 },
				);
			}

			if (response.status === 400) {
				return NextResponse.json(
					{
						error: "Invalid request. Please check your search query.",
						details: "The search query format is not supported by the API.",
					},
					{ status: 400 },
				);
			}

			// Generic error for other status codes
			return NextResponse.json(
				{
					error: "Weather service temporarily unavailable",
					details: `API returned ${response.status}: ${response.statusText}`,
				},
				{ status: 502 },
			);
		}

		const data = await response.json();
		console.log("✅ Search successful, found", data.length, "cities");
		return NextResponse.json(data);
	} catch (error) {
		console.error("❌ City search error:", error);
		return NextResponse.json(
			{
				error: "Failed to search cities",
				details: "Network error or service unavailable",
			},
			{ status: 500 },
		);
	}
}
