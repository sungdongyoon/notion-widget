"use client";

import React, { useState } from "react";
import style from "./quotes.module.scss";
import { IoReloadCircle } from "react-icons/io5";
import axios from "axios";

const QuotesClient = ({ data }) => {
  const [quotes, setQuotes] = useState(data[0]);

  // 인용구 새로고침
  const reloadQuotes = async () => {
    try {
      const response = await axios.get("/api/quotes");
      const data = Array.isArray(response.data) ? response.data[0] : null;

      if (response) setQuotes(data);
    } catch (error) {
      console.error("get quotes api error", error);
    }
  };

  return (
    <div className="container">
      <div className={style["quotes-container"]}>
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
