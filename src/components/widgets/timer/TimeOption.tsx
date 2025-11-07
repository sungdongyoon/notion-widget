"use client";

import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  { id: "default", label: "Defualt" },
  { id: "brown", label: "Brown" },
  { id: "orange", label: "Orange" },
  { id: "yellow", label: "Yellow" },
  { id: "green", label: "Green" },
  { id: "blue", label: "Blue" },
  { id: "purple", label: "Purple" },
  { id: "pink", label: "Pink" },
  { id: "red", label: "Red" },
] as const;

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

  const [hour, setHour] = useState<string>(String(initH));
  const [minute, setMinute] = useState<string>(String(initM));
  const [second, setSecond] = useState<string>(String(initS));

  const [open, setOpen] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>("");

  useEffect(() => {
    setHour(String(initH));
    setMinute(String(initM));
    setSecond(String(initS));
  }, [value]);

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

  const handleApply = () => {
    onApply?.({
      hour: Number(hour || 0),
      minute: Number(minute || 0),
      second: Number(second || 0),
    });

    setOpen(false);
  };

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
        <div className="grid gap-4">
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

            <button
              className="mt-2 h-8 rounded bg-black text-white text-sm"
              onClick={handleApply}
            >
              적용하기
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Time Theme</h4>
            <p className="text-muted-foreground text-sm">
              타이머 테마를 설정해주세요.
            </p>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
        {activeOption?.includes("label") && (
          <div className="grid gap-4">
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
                value={timerLabel}
                onChange={(e) => setTimerLabel(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
            <button
              className="mt-2 h-8 rounded bg-black text-white text-sm"
              onClick={() => applyLabel?.(timerLabel)}
            >
              적용하기
            </button>
          </div>
        )}
        {activeOption?.includes("color") && (
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Color</h4>
              <p className="text-muted-foreground text-sm">
                타이머의 메인 색상을 선택해주세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/***************************
 * 작업해야 할 것들
 * 1. 라벨, 메인 컬러 localstorage 적용
 * 2. running일때 새로고침 하면 초기화 되는 문제 개선
 * 3. label 개행 처리?
 ****************************/
