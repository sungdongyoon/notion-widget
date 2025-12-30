import { getApiReverseGeocoding } from "@/lib/reverseGeocoding";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  const data = await getApiReverseGeocoding({ lat, lon });

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "https://www.notion.so",
    },
  });
}
