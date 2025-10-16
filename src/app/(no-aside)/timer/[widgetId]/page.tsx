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
      () => import("@/components/widgets/timer/Timer01")
    ) as ComponentType<any>,
    getProps: async () => ({ props: "test props" }),
  },
  1002: {
    Comp: dynamic(
      () => import("@/components/widgets/timer/Timer02")
    ) as ComponentType<any>,
  },
};

export default async function TimerPage({
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
