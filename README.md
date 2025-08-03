<a href="https://weather-os.vercel.app">
<img alt="Beautiful Weather with MacOS-inspired Design" src="./public/preview/weather-os.png">
  <h1 align="center">WeatherOS</h1>
</a>

<p align="center">
  Beautiful Weather with MacOS-inspired Design
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy your own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org)
  - App Router with file-based routing and server components
  - Built-in API routes for AccuWeather integration
- [AccuWeather API](https://developer.accuweather.com)
  - Real-time weather data and forecasts
  - Current conditions, hourly, and 10-day forecasts
- [Shadcn/ui](https://ui.shadcn.com)
  - Beautiful, accessible UI components built with Radix UI
  - Custom components for consistent design and developer experience

## Deploy your own

You can deploy your own version of WeatherOS to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fweather&env=ACCUWEATHER_API_KEY&envDescription=Your%20AccuWeather%20API%20key%20for%20weather%20data&envLink=https%3A%2F%2Fdeveloper.accuweather.com%2F&demo-title=WeatherOS&demo-description=Beautiful%20weather%20application%20with%20macOS-inspired%20design%20built%20with%20Next.js%2015%20and%20AccuWeather%20API.&demo-url=https%3A%2F%2Fweatheros.vercel.app)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run WeatherOS. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various accounts.

1. Clone the repository: `git clone https://github.com/muradpm/weather-app.git`
2. Install Vercel CLI: `bun i -g vercel`
3. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
4. Download your environment variables: `vercel env pull`

```bash
bun install
bun dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/)