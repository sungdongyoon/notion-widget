import { getApiWeather } from "@/lib/weather";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  const data = await getApiWeather({ lat, lon });

  return NextResponse.json(data);
}
