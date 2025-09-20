import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const WIDGETS = {
  1001: {
    Comp: dynamic(() => import("@/components/widgets/timer/Timer01")),
    getProps: async () => ({ props: "test props" }),
  },
  1002: {
    Comp: dynamic(() => import("@/components/widgets/timer/Timer02")),
  },
};

export default async function Timer({ params }) {
  const entry = WIDGETS[params.widgetId];
  if (!entry) return notFound();

  const Comp = entry.Comp;
  const props = entry.getProps ? await entry.getProps(params) : {};

  return <Comp {...props} />;
}
