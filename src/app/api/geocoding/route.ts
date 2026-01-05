import { getApiGeocoding } from "@/lib/geocoding";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "address parameter is required" },
      { status: 400 }
    );
  }

  const data = await getApiGeocoding({ address });

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "https://www.notion.so",
    },
  });
}
