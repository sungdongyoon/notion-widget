import React from "react";
import QuotesClient from "./QuotesClient";
import { getApiQuotes } from "@/lib/quotes";

const Quotes = async () => {
  const data = await getApiQuotes();

  return <QuotesClient data={data} />;
};

export default Quotes;
