import React from "react";
import QuotesClient from "./QuotesClient";
import { notFound } from "next/navigation";
import { getApiQuotes } from "@/lib/quotes";

// 이미지 리스트
const BG_IMAGE = {
  typeA: [
    "/image/quotes/quotes_bg1.jpg",
    "/image/quotes/quotes_bg2.jpg",
    "/image/quotes/quotes_bg3.jpg",
    "/image/quotes/quotes_bg4.jpg",
    "/image/quotes/quotes_bg5.jpg",
  ],
  typeB: [
    "/image/quotes/quotes_paper_bg1.png",
    "/image/quotes/quotes_paper_bg2.png",
    "/image/quotes/quotes_paper_bg3.png",
    "/image/quotes/quotes_paper_bg4.png",
    "/image/quotes/quotes_paper_bg5.png",
    "/image/quotes/quotes_paper_bg6.png",
    "/image/quotes/quotes_paper_bg7.png",
    "/image/quotes/quotes_paper_bg8.png",
  ],
  typeC: [
    "/image/quotes/quotes_paper_bg1.png",
    "/image/quotes/quotes_paper_bg2.png",
    "/image/quotes/quotes_paper_bg3.png",
    "/image/quotes/quotes_paper_bg4.png",
    "/image/quotes/quotes_paper_bg5.png",
    "/image/quotes/quotes_paper_bg6.png",
    "/image/quotes/quotes_paper_bg7.png",
    "/image/quotes/quotes_paper_bg8.png",
  ],
};

// 위젯 타입 화이트리스트
const ALLOWED_TYPE = new Set(Object.keys(BG_IMAGE));

export default async function Page({ params }) {
  // 위젯 아이디
  const widgetId = (params.widgetId ?? "").trim();

  // 화이트 리스트에 걸리지 않는 위젯 아이디는 not found 페이지로 이동
  if (!ALLOWED_TYPE.has(widgetId)) {
    notFound();
  }

  // 타입 별 이미지 배열
  const useImageArr = BG_IMAGE[widgetId];
  // 인용구 데이터
  const data = await getApiQuotes();
  // 이미지 배열 난수
  const randomIndex = Math.floor(Math.random() * useImageArr.length);

  return (
    <QuotesClient
      data={data}
      images={useImageArr}
      randomIndex={randomIndex}
      widgetId={widgetId}
    />
  );
}
