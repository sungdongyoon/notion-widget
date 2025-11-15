"use client";

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
  value: number;
  onApply?: (payload: ApplyTimePayload) => void;
  applyColor?: (payload: string) => void;
  applyLabel?: (payload: string) => void;
  disabled?: boolean;
  style?: string;
  activeOption?: ("hour" | "minute" | "second" | "color" | "label")[];
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
  const totalSec = Math.floor((Number(value) || 0) / 1000);
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
    label: "",
    length: 0,
  });
  const [overLimit, setOverLimit] = useState<boolean>(false);

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
  }, [value]);

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
    max-h-[min(90vh,420px)]
    overflow-auto
    flex flex-col gap-4
    p-[clamp(0.5rem,3vmin,1rem)]
    scroll-pt-16"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full sticky top-0 flex justify-center items-center flex-wrap z-10">
          <Tabs
            onValueChange={(value) => {
              document.getElementById(value)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <TabsList className="h-[clamp(1.6rem,5vmin,2.25rem)]">
              <TabsTrigger
                value="time"
                className="text-[clamp(0.6rem,3vmin,0.8rem)]"
              >
                Time
              </TabsTrigger>
              <TabsTrigger
                value="theme"
                className="text-[clamp(0.6rem,3vmin,0.8rem)]"
              >
                Theme
              </TabsTrigger>
              <TabsTrigger
                value="label"
                className="text-[clamp(0.6rem,3vmin,0.8rem)]"
              >
                Label
              </TabsTrigger>
              <TabsTrigger
                value="color"
                className="text-[clamp(0.6rem,3vmin,0.8rem)]"
              >
                Color
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-4 scroll-mt-3" id="time">
          <div className="space-y-2">
            <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
              Time Select
            </h4>
            <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
              타이머 시간을 설정해주세요.
            </p>
          </div>
          <div className="grid gap-2">
            {activeOption?.includes("hour") && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label
                  htmlFor="hour"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  hour
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
                  minute
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
                  second
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

        <div className="grid gap-4 mt-7" id="theme">
          <div className="space-y-2">
            <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
              Theme
            </h4>
            <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
              타이머 테마를 설정해주세요.
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="bg-white text-black text-[clamp(0.6rem,3vmin,0.8rem)] h-[clamp(1.7rem,5vmin,2rem)]"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant="outline"
              className="bg-black text-white text-[clamp(0.6rem,3vmin,0.8rem)] h-[clamp(1.7rem,5vmin,2rem)]"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </div>

        {activeOption?.includes("label") && (
          <div className="grid gap-4 mt-7" id="label">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                Label
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                타이머에 표시할 라벨을 입력해주세요.
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
              <p className="text-[clamp(0.6rem,3vmin,0.8rem)] text-gray-500 mt-1 text-right">
                {timerLabel.length} / {LABEL_MAX_LENGTH}
              </p>
            </div>
          </div>
        )}

        {activeOption?.includes("color") && (
          <div className="grid gap-4 mt-7" id="color">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                Color
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                타이머의 메인 색상을 선택해주세요.
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
        <Button
          size="sm"
          variant="destructive"
          className="fixed bottom-2 right-5 bg-red-500 h-[clamp(1.8rem,5vmin,2rem)] px-[clamp(1rem,3vmin,1.5rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
          onClick={handleApply}
        >
          저장
        </Button>
      </PopoverContent>
    </Popover>
  );
}
