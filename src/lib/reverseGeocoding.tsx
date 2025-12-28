import axios from "axios";

type Location = {
  lat: number;
  lon: number;
};

export async function getApiReverseGeocoding({ lat, lon }: Location) {
  const id = process.env.NAVER_MAP_CLIENT_ID;
  const key = process.env.NAVER_MAP_CLIENT_SECRET;

  if (!id || !key) {
    throw new Error("Reverse Geocoding API Key Missing!");
  }

  const { data } = await axios.get(
    `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc`,
    {
      params: {
        request: "coordsToaddr",
        coords: `${lon},${lat}`,
        sourcecrs: "epsg:4326",
        orders: "legalcode,admcode", // legalcode : 법정동 | admcode : 행정동 | addr : 지번 주소 변환 | roadaddr : 도로명 주소 변환
        output: "json",
      },
      headers: {
        "x-ncp-apigw-api-key-id": id,
        "x-ncp-apigw-api-key": key,
      },
    }
  );

  return data;
}
