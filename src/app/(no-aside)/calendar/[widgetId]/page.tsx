import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ComponentType } from "react";

type WidgetEntry = {
  Comp: ComponentType<any>;
  getProps?: (params: { widgetId: string }) => Promise<Record<string, any>>;
};

const WIDGETS: Record<string, WidgetEntry> = {
  1001: {
    Comp: dynamic(
      () => import("@/components/widgets/calendar/Calendar01")
    ) as ComponentType<any>,
    // getProps: async () => ({ props: "test props" }),
  },
};

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ widgetId: string }>;
}) {
  const { widgetId } = await params;
  const entry = WIDGETS[widgetId];
  if (!entry) return notFound();

  const Comp = entry.Comp;
  const props = entry.getProps ? await entry.getProps({ widgetId }) : {};

  return <Comp {...props} />;
}
