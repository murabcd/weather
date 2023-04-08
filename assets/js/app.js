window.addEventListener("load", () => {
  let long;
  let lat;

  // Get UI elements
  const locationTimezone = document.querySelector(".location-timezone");
  const temperatureDegree = document.querySelector(".temperature-degree");
  const temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  const weatherIcon = document.querySelector(".weather-icon");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const apiKey = "YOUR_ACCUWEATHER_API_KEY";

      const getLocationData = async () => {
        const locationApi = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`;
        const response = await fetch(locationApi);
        const data = await response.json();
        return data;
      };

      const getWeatherData = async (locationKey) => {
        const weatherApi = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&metric=true`;
        const response = await fetch(weatherApi);
        const data = await response.json();
        // console.log("API response:", data);

        // Update UI elements with fetched data
        temperatureDegree.textContent =
          data.DailyForecasts[0].Temperature.Maximum.Value.toFixed(1); // Display temperature in Celsius
        temperatureDescription.textContent = data.Headline.Text;

        // Determine whether it's day or night
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const isDaytime = currentHour >= 6 && currentHour < 18;

        // Get the appropriate weather icon number
        const iconNumber = isDaytime
          ? data.DailyForecasts[0].Day.Icon
          : data.DailyForecasts[0].Night.Icon;

        if (iconNumber) {
          const iconUrl = `https://developer.accuweather.com/sites/default/files/${
            iconNumber < 10 ? "0" : ""
          }${iconNumber}-s.png`;
          // console.log("Icon URL:", iconUrl); // Log the icon URL
          weatherIcon.setAttribute("src", iconUrl);
        } else {
          // console.log("Weather icon number not found in the API response.");
        }
      };

      const locationData = await getLocationData();
      const locationKey = locationData.Key;
      locationTimezone.textContent = locationData.TimeZone.Name; // Update location timezone
      getWeatherData(locationKey);
    });
  }
});
