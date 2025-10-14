import axios from "axios";

export async function getApiQuotes() {
  const { data } = await axios.get("https://api.api-ninjas.com/v1/quotes", {
    headers: { "X-Api-Key": process.env.QUOTES_API_KEY },
  });

  return data;
}
