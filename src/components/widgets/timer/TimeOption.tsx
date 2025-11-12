"use client";

import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const scrollToSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.value;

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
        sideOffset={10}
        align="end"
        className="w-[clamp(16rem,92vw,22rem)]
    max-h-[min(70vh,420px)]
    overflow-auto
    flex flex-col gap-4
    p-4 sm:p-5"
      >
        <div className="grid gap-4 mt-10" id="time">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Time Select</h4>
            <p className="text-muted-foreground text-sm">
              타이머 시간을 설정해주세요.
            </p>
          </div>
          <div className="grid gap-2">
            {activeOption?.includes("hour") && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="hour">hour</Label>
                <Input
                  id="hour"
                  type="text"
                  inputMode="numeric"
                  value={hour}
                  onChange={onHourChange}
                  onBlur={() => setHour(onBlurClamp(hour, 23))}
                  className="col-span-2 h-8"
                />
              </div>
            )}
            {activeOption?.includes("minute") && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="minute">minute</Label>
                <Input
                  id="minute"
                  type="text"
                  inputMode="numeric"
                  value={minute}
                  onChange={onMinuteChange}
                  onBlur={() => setMinute(onBlurClamp(minute, 59))}
                  className="col-span-2 h-8"
                />
              </div>
            )}
            {activeOption?.includes("second") && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="second">second</Label>
                <Input
                  id="second"
                  type="text"
                  inputMode="numeric"
                  value={second}
                  onChange={onSecondChange}
                  onBlur={() => setSecond(onBlurClamp(second, 59))}
                  className="col-span-2 h-8"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 mt-7" id="theme">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Theme</h4>
            <p className="text-muted-foreground text-sm">
              타이머 테마를 설정해주세요.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              className="bg-white text-black"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant="outline"
              className="bg-black text-white"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </div>

        {activeOption?.includes("label") && (
          <div className="grid gap-4 mt-7" id="label">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Label</h4>
              <p className="text-muted-foreground text-sm">
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
                className={`col-span-2 h-8 ${
                  overLimit ? "timer_label_input border-red-500" : ""
                }`}
              />
              <div className="relative w-full h-1 bg-gray-200 rounded mt-2">
                <div
                  className="absolute top-0 left-0 h-full rounded bg-blue-500 transition-all"
                  style={{ width: `${labelPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {timerLabel.length} / {LABEL_MAX_LENGTH}
              </p>
            </div>
          </div>
        )}

        {activeOption?.includes("color") && (
          <div className="grid gap-4 mt-7" id="color">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Color</h4>
              <p className="text-muted-foreground text-sm">
                타이머의 메인 색상을 선택해주세요.
              </p>
            </div>
            {/* <div className="grid gap-2 grid-cols-2">
              {COLOR_OPTIONS.map(({ id, label }) => {
                return (
                  <Button
                    key={id}
                    type="button"
                    onClick={() => applyColor?.(id)}
                    className={`bg-notion-${id}-bg text-notion-${id}-text`}
                  >
                    {label}
                  </Button>
                );
              })}
            </div> */}
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
        <div className="w-full p-3 fixed top-0 left-0 bg-white flex justify-between items-center">
          <ButtonGroup>
            <Button
              size="sm"
              variant="outline"
              value="time"
              onClick={scrollToSection}
            >
              Time
            </Button>
            <Button
              size="sm"
              variant="outline"
              value="theme"
              onClick={scrollToSection}
            >
              Theme
            </Button>
            <Button
              size="sm"
              variant="outline"
              value="label"
              onClick={scrollToSection}
            >
              Label
            </Button>
            <Button
              size="sm"
              variant="outline"
              value="color"
              onClick={scrollToSection}
            >
              Color
            </Button>
          </ButtonGroup>
          <Button size="sm" onClick={handleApply}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
