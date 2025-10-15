"use client";

import React, { useState } from "react";
import { IoReloadCircle } from "react-icons/io5";
import axios from "axios";
import Image from "next/image";

type Quote = { quote?: string; author?: string };
type Props = {
  data: Quote[];
  images: readonly string[];
  randomIndex: number;
  widgetId: string;
};

const QuotesClient = ({ data, images, randomIndex, widgetId }: Props) => {
  const [quotes, setQuotes] = useState<Quote | undefined>(data[0]);
  const [imageIndex, setImageIndex] = useState<number>(randomIndex);

  // 인용구 새로고침
  const reloadQuotes = async () => {
    try {
      const response = await axios.get("/api/quotes");
      const data = Array.isArray(response.data) ? response.data[0] : null;

      setImageIndex(Math.floor(Math.random() * images.length));

      if (response) setQuotes(data);
    } catch (error) {
      console.error("get quotes api error", error);
    }
  };

  return (
    <div className="widget_container">
      <div className={`quotes_container`} data-variant={widgetId}>
        <Image
          src={images[imageIndex]}
          fill
          priority
          sizes="(max-width: 500px) 100vw, 500px"
          className="quotes_bg"
          alt="quotes_background"
        />
        <div className="quotes_content">
          <p>{quotes?.quote ?? ""}</p>
        </div>
        <div className="quotes_author">
          <p>{quotes?.author ?? ""}</p>
        </div>
        <div className="quotes_refresh">
          <button onClick={reloadQuotes}>
            <IoReloadCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotesClient;
