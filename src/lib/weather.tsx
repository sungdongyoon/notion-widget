import axios from "axios";

type Location = {
  lat: number;
  lon: number;
};

export async function getApiWeather({ lat, lon }: Location) {
  const key = process.env.WEATHER_API_KEY;
  if (!key) throw new Error("Weather API Key Missing!");

  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`,
    {
      params: { lat, lon, units: "metric", appid: key },
    }
  );

  return data;
}
