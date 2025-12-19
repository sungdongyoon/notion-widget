import { getApiWeatherForecast5Days } from "@/lib/weatherForcast5days";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  const data = await getApiWeatherForecast5Days({ lat, lon });

  return NextResponse.json(data);
}
