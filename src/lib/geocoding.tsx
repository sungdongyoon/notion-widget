import axios from "axios";

export async function getApiGeocoding({ address }: { address: string }) {
  const id = process.env.NAVER_MAP_CLIENT_ID;
  const key = process.env.NAVER_MAP_CLIENT_SECRET;

  const { data } = await axios.get(
    `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${address}`,
    {
      headers: {
        "x-ncp-apigw-api-key-id": id,
        "x-ncp-apigw-api-key": key,
        Accept: "application/json",
      },
    }
  );

  return data;
}
