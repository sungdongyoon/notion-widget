import { getApiWeather } from "@/lib/weather";
import { notFound } from "next/navigation";
import { ComponentType } from "react";
import dynamic from "next/dynamic";
import { getApiWeatherForecast5Days } from "@/lib/weatherForcast5days";

type WidgetEntry = {
  Comp: ComponentType<any>;
  getProps?: (params: { widgetId: string }) => Promise<Record<string, any>>;
};

const WIDGETS: Record<string, WidgetEntry> = {
  2001: {
    Comp: dynamic(
      () => import("@/components/widgets/weather/Weather01")
    ) as ComponentType<any>,
  },
};

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ widgetId: string }>;
}) {
  // 위젯 아이디
  const { widgetId } = await params;
  const entry = WIDGETS[widgetId];
  [widgetId];

  if (!entry) return notFound();

  const Comp = entry.Comp;
  const props = entry.getProps ? await entry.getProps({ widgetId }) : {};

  return <Comp {...props} />;
}
