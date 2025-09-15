import axios from "axios";

export async function getApiWeather() {
  const lat = "37.5511121532521";
  const lon = "126.98819670241075";
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
  );

  return data;
}
