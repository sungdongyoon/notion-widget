"use client";

import React, { useState } from "react";
import style from "./quotes.module.scss";
import { IoReloadCircle } from "react-icons/io5";
import axios from "axios";
import Image from "next/image";

const QuotesClient = ({ data, images, randomIndex }) => {
  const [quotes, setQuotes] = useState(data[0]);
  const [imageIndex, setImageIndex] = useState(randomIndex);

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
    <div className="container">
      <div className={style["quotes-container"]}>
        <Image
          src={images[imageIndex]}
          fill
          priority
          sizes="(max-width: 500px) 100vw, 500px"
          className={style["bg"]}
          alt="quotes_background"
        />
        <div className={style["quotes-content"]}>
          <p>{quotes?.quote ?? ""}</p>
        </div>
        <div className={style["quotes-author"]}>
          <p>{quotes?.author ?? ""}</p>
        </div>
        <div className={style["quotes-refresh"]}>
          <button onClick={reloadQuotes}>
            <IoReloadCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotesClient;
