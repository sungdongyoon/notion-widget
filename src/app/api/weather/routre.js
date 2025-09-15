import { getApiWeather } from "@/lib/weather";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getApiWeather();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("weather 데이터 로드 실패", error);
  }
}
