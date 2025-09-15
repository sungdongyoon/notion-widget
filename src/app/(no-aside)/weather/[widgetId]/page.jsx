import { getApiWeather } from "@/lib/weather";
import WeatherClient from "./WeatherClient";

// 위젯 타입 화이트리스트
const ALLOWED_TYPE = ["typeA"];

export default async function Page({ params }) {
  // 위젯 아이디
  const widgetId = (params.widgetId ?? "").trim();

  // 화이트 리스트에 걸리지 않는 위젯 아이디는 not found 페이지로 이동
  if (!ALLOWED_TYPE.includes(widgetId)) {
    notFound();
  }

  const data = await getApiWeather();

  console.log("data", data);
  return <WeatherClient data={data} widgetId={widgetId} />;
}
