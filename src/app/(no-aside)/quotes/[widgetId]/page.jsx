import React from "react";
import QuotesClient from "./QuotesClient";
import { getApiQuotes } from "@/lib/quotes";

const BG_IMAGE = [
  "/image/quotes_bg1.jpg",
  "/image/quotes_bg2.jpg",
  "/image/quotes_bg3.jpg",
  "/image/quotes_bg4.jpg",
  "/image/quotes_bg5.jpg",
];

const Quotes = async () => {
  const data = await getApiQuotes();
  const randomIndex = Math.floor(Math.random() * BG_IMAGE.length);

  return (
    <QuotesClient data={data} images={BG_IMAGE} randomIndex={randomIndex} />
  );
};

export default Quotes;
