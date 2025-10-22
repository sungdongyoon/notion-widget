import { useEffect, useMemo, useState } from "react";

function getBreakpoint(width: number): string {
  if (width <= 150) return "7xs";
  if (width <= 180) return "6xs";
  if (width <= 240) return "5xs";
  if (width <= 300) return "4xs";
  if (width <= 360) return "3xs";
  if (width <= 420) return "2xs";
  if (width <= 520) return "xs";
  if (width <= 640) return "sm";
  if (width <= 720) return "md";
  if (width <= 1024) return "lg";
  if (width <= 1280) return "xl";
  if (width <= 1536) return "2xl";
  return "";
}

const BreakPointView = () => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const breakPoint = useMemo(() => getBreakpoint(width), [width]);

  return (
    <div className="fixed top-3 left-3 bg-black border border-solid border-white text-white text-[0.8rem] w-[170px] px-6 py-3 rounded-[10px]">
      <p>너비 : {width}</p>
      <p>Break Point : {breakPoint}</p>
    </div>
  );
};

export default BreakPointView;
