import { getApiQuotes } from "@/lib/quotes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getApiQuotes();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("quotes 데이터 로드 실패", error);
  }
}
