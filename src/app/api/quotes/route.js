import { getApiQuotes } from "@/lib/quotes";
import axios from "axios";
import { NextResponse } from "next/server";

const client = axios.create({
  baseURL: "https://api.api-ninjas.com/v1",
  timeout: 8000,
  headers: {
    "X-Api-Key": process.env.QUOTES_API_KEY,
  },
});

export async function GET() {
  try {
    // const { data, status } = await client.get("/quotes");
    const data = await getApiQuotes();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("quotes 데이터 로드 실패", error);
  }
}
