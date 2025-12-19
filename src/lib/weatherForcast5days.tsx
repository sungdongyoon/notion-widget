import axios from "axios";

type Location = {
  lat: number;
  lon: number;
};

export async function getApiWeatherForecast5Days({ lat, lon }: Location) {
  const key = process.env.WEATHER_API_KEY;
  if (!key) throw new Error("Weather API Key Missing!");

  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`,
    {
      params: { lat, lon, units: "metric", lang: "kr", appid: key },
    }
  );

  return data;
}
