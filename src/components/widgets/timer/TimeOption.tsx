"use client";

import LangToggle from "@/components/LangToggle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

import { FaGear } from "react-icons/fa6";

type ApplyTimePayload = {
  hour: number;
  minute: number;
  second: number;
};

type TimeOptionProps = {
  value: {
    time: number;
    label?: string;
  };
  onApply?: (payload: ApplyTimePayload) => void;
  applyColor?: (payload: string) => void;
  applyLabel?: (payload: string) => void;
  disabled?: boolean;
  style?: string;
  activeOption?: ("hour" | "minute" | "second" | "color" | "theme" | "label")[];
};

// 색상 배열
const COLOR_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "brown", label: "Brown" },
  { id: "orange", label: "Orange" },
  { id: "yellow", label: "Yellow" },
  { id: "green", label: "Green" },
  { id: "blue", label: "Blue" },
  { id: "purple", label: "Purple" },
  { id: "pink", label: "Pink" },
  { id: "red", label: "Red" },
] as const;

// label 최대 길이
const LABEL_MAX_LENGTH = 10;

export default function TimeOption({
  value,
  onApply,
  applyColor,
  applyLabel,
  disabled,
  style,
  activeOption,
}: TimeOptionProps) {
  const totalSec = Math.floor((Number(value.time) || 0) / 1000);
  const initH = Math.floor(totalSec / 3600);
  const initM = Math.floor((totalSec % 3600) / 60);
  const initS = totalSec % 60;

  // 테마 변경 함수
  const { theme, setTheme } = useTheme();

  const [hour, setHour] = useState<string>(String(initH));
  const [minute, setMinute] = useState<string>(String(initM));
  const [second, setSecond] = useState<string>(String(initS));

  const [open, setOpen] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<{
    label: string;
    length: number;
  }>({
    label: value.label ?? "",
    length: 0,
  });
  const [overLimit, setOverLimit] = useState<boolean>(false);
  const [optionSection, setOptionSection] = useState<string>("time");

  const t = useTranslations("TimeOption");

  const labelPercent = (timerLabel.length / LABEL_MAX_LENGTH) * 100;

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));
  const only2Digits = (v: string) => /^\d{0,2}$/.test(v); // 최대 2자리, 빈 문자열 허용
  const onBlurClamp = (v: string, max: number) =>
    String(clamp(Number(v || 0), 0, max));

  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setHour(v);
  };
  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setMinute(v);
  };
  const onSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setSecond(v);
  };

  // 시간, 라벨 저장
  const handleApply = () => {
    onApply?.({
      hour: Number(hour || 0),
      minute: Number(minute || 0),
      second: Number(second || 0),
    });

    applyLabel?.(timerLabel.label);

    setOpen(false);
  };

  // 라벨 입력 함수
  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= LABEL_MAX_LENGTH) {
      setTimerLabel({
        label: value,
        length: value.length,
      });

      return;
    }

    setOverLimit(true);
    setTimeout(() => {
      setOverLimit(false);
    }, 300);
  };

  // 섹션 스크롤 함수
  // const scrollToSection = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const id = e.currentTarget.value;

  //   document.getElementById(id)?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  // 시간 세팅
  useEffect(() => {
    setHour(String(initH));
    setMinute(String(initM));
    setSecond(String(initS));
  }, [value.time]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`${style} ${
            disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"
          }`}
          disabled={disabled}
        >
          <FaGear />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={-20}
        align="end"
        className="w-[clamp(16rem,92vw,22rem)]
    h-[min(80vh,400px)]
    overflow-auto
    flex flex-col gap-3
    p-[clamp(0.6rem,3vmin,1rem)]
    scroll-pt-16"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full flex justify-center items-center flex-wrap z-10">
          <Tabs
            onValueChange={(value) => {
              // document.getElementById(value)?.scrollIntoView({
              //   behavior: "smooth",
              //   block: "start",
              // });
              setOptionSection(value);
            }}
            defaultValue="time"
          >
            <TabsList className="h-[clamp(1.6rem,5vmin,2.25rem)]">
              {activeOption?.some((opt) =>
                ["hour", "minute", "second"].includes(opt)
              ) && (
                <TabsTrigger
                  value="time"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  {t("Tab.time")}
                </TabsTrigger>
              )}
              {/* {activeOption?.includes("label") && (
                <TabsTrigger
                  value="label"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  Label
                </TabsTrigger>
              )} */}
              {activeOption?.includes("theme") && (
                <TabsTrigger
                  value="theme"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  {t("Tab.theme")}
                </TabsTrigger>
              )}
              {activeOption?.includes("color") && (
                <TabsTrigger
                  value="color"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  {t("Tab.color")}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="created"
                className="text-[clamp(0.6rem,3vmin,0.8rem)]"
              >
                {t("Tab.copyright")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {optionSection === "time" && (
          <>
            <div className="grid gap-4 scroll-mt-3" id="time">
              <div className="space-y-2">
                <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                  {t("Time.title")}
                </h4>
                <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                  {t("Time.desc")}
                </p>
              </div>
              <div className="grid gap-2">
                {activeOption?.includes("hour") && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="hour"
                      className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                    >
                      {t("Time.hour")}
                    </Label>
                    <Input
                      id="hour"
                      type="text"
                      inputMode="numeric"
                      value={hour}
                      onChange={onHourChange}
                      onBlur={() => setHour(onBlurClamp(hour, 23))}
                      className="col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
                    />
                  </div>
                )}
                {activeOption?.includes("minute") && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="minute"
                      className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                    >
                      {t("Time.minute")}
                    </Label>
                    <Input
                      id="minute"
                      type="text"
                      inputMode="numeric"
                      value={minute}
                      onChange={onMinuteChange}
                      onBlur={() => setMinute(onBlurClamp(minute, 59))}
                      className="col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
                    />
                  </div>
                )}
                {activeOption?.includes("second") && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="second"
                      className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                    >
                      {t("Time.second")}
                    </Label>
                    <Input
                      id="second"
                      type="text"
                      inputMode="numeric"
                      value={second}
                      onChange={onSecondChange}
                      onBlur={() => setSecond(onBlurClamp(second, 59))}
                      className="col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
                    />
                  </div>
                )}
              </div>
            </div>
            {activeOption?.includes("label") && (
              <div className="grid gap-4 mt-7" id="label">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                    {t("Label.title")}
                  </h4>
                  <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                    {t("Label.desc")}
                  </p>
                </div>
                <div>
                  <Input
                    id="timer-label"
                    type="text"
                    placeholder="예) study 📝"
                    value={timerLabel.label}
                    onChange={onLabelChange}
                    className={`col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)] ${
                      overLimit ? "timer_label_input border-red-500" : ""
                    }`}
                  />
                  <div className="relative w-full h-1 bg-gray-200 rounded mt-2">
                    <div
                      className="absolute top-0 left-0 h-full rounded bg-blue-500 transition-all"
                      style={{ width: `${labelPercent}%` }}
                    />
                  </div>
                  <p className="text-[clamp(0.6rem,3vmin,0.8rem)] text-gray-500 mt-1 text-left">
                    {timerLabel.length} / {LABEL_MAX_LENGTH}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {activeOption?.includes("theme") && optionSection === "theme" && (
          <div className="grid gap-4" id="theme">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                {t("Theme.title")}
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                {t("Theme.desc")}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                className="bg-white text-black text-[clamp(0.6rem,3vmin,0.8rem)] h-[clamp(1.7rem,5vmin,2rem)]"
                onClick={() => setTheme("light")}
              >
                {t("Theme.light")}
              </Button>
              <Button
                variant="outline"
                className="bg-black text-white text-[clamp(0.6rem,3vmin,0.8rem)] h-[clamp(1.7rem,5vmin,2rem)]"
                onClick={() => setTheme("dark")}
              >
                {t("Theme.dark")}
              </Button>
            </div>
          </div>
        )}

        {activeOption?.includes("color") && optionSection === "color" && (
          <div className="grid gap-4" id="color">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                {t("Color.title")}
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                {t("Color.desc")}
              </p>
            </div>
            <div className="grid gap-2 grid-cols-3">
              {COLOR_OPTIONS.map(({ id, label }) => {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyColor?.(id)}
                    className="relative aspect-square border rounded-lg hover:scale-105 transition-all"
                  >
                    <Image
                      src={`/image/timer/color/${theme}-${id}.png`}
                      fill
                      alt={`${label} 아이콘`}
                      className="rounded-lg"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {optionSection === "created" && (
          <div
            className="flex justify-center items-center w-full h-full"
            id="created"
          >
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)] text-center">
                Thank You !
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                © 2026 Created by Mober & Dong
              </p>
            </div>
          </div>
        )}

        <LangToggle />
        {optionSection !== "created" && (
          <Button
            size="sm"
            variant="destructive"
            className="fixed z-50 bottom-2 right-5 bg-red-500 h-[clamp(1.8rem,5vmin,2rem)] px-[clamp(1rem,3vmin,1.5rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
            onClick={handleApply}
          >
            저장
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

/**********
 * 노션에서 위젯에 마우스 올리면 우측 상단에 노션 옵션 탭이 떠서 스크롤 탭이 가려지는 문제 발생
 * 다른 방법으로 스크롤 탭 노출 시켜야함
 */
